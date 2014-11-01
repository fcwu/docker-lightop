#!/usr/bin/env python

import os
import time
import sys
import subprocess
import signal


def run_with_reloader(main_func, extra_files=None, interval=1):
    """Run the given function in an independent python interpreter."""
    def find_files(directory="./"):
        for root, dirs, files in os.walk(directory):
            for basename in files:
                if basename.endswith('.py'):
                    filename = os.path.join(root, basename)
                    yield filename

    if os.environ.get('WERKZEUG_RUN_MAIN') == 'true':
        try:
            os.setpgid(0, 0)
            main_func()
        except KeyboardInterrupt:
            pass
        return

    procs = None
    try:
        while True:
            print('* Restarting with reloader ' + str(sys.executable))
            args = [sys.executable] + sys.argv
            new_environ = os.environ.copy()
            new_environ['WERKZEUG_RUN_MAIN'] = 'true'

            procs = subprocess.Popen(args, env=new_environ)
            mtimes = {}
            restart = False
            while not restart:
                for filename in find_files():
                    try:
                        mtime = os.stat(filename).st_mtime
                    except OSError:
                        continue

                    old_time = mtimes.get(filename)
                    if old_time is None:
                        mtimes[filename] = mtime
                        continue
                    elif mtime > old_time:
                        print('* Detected change in %r, reloading' % filename)
                        restart = True
                        break
                    time.sleep(interval)

            killpg(procs.pid, signal.SIGTERM)
    except KeyboardInterrupt:
        pass
    finally:
        killpg(procs.pid, signal.SIGTERM)


def killpg(pgid, send_signal=signal.SIGKILL):
    print('kill PGID {}'.format(pgid))
    try:
        os.killpg(pgid, send_signal)
        #os.killpg(pgid, signal.SIGKILL)
    except:
        pass


def create_instance_config():
    if not os.path.exists('instance'):
        os.makedirs('instance')

    with open(os.path.join('instance', 'application.cfg'), 'wb+') as f:
        f.write('SECRET_KEY = \'')
        f.write("".join("\\x{:02x}".format(ord(c)) for c in os.urandom(24)))
        f.write('\'\n')
        f.write('VERSION = \'')
        if os.path.exists('version'):
            with open('version') as fv:
                version = fv.read().strip()
            f.write(version)
        else:
            f.write('unknown')
        f.write('\'\n')
    if '--debug' not in sys.argv:
        os.chmod(os.path.join('instance', 'application.cfg'), 0600)


def main():
    create_instance_config()

    def run_server():
        from gevent import monkey
        monkey.patch_all(subprocess=True)
        from gevent.wsgi import WSGIServer
        import socket
        from geventwebsocket.handler import WebSocketHandler

        os.environ['CONFIG'] = CONFIG
        from lightop import app

        if not DEBUG:  # run on NAS
            from werkzeug import SharedDataMiddleware
            app.wsgi_app = SharedDataMiddleware(app.wsgi_app, {
                '/': os.path.join(os.path.dirname(__file__), 'static')
                })
        # websocket conflict: WebSocketHandler
        if DEBUG or STAGING:
            # from werkzeug.debug import DebuggedApplication
            app.debug = True
            # app = DebuggedApplication(app, evalex=True)

        print('Fork monitor programs')
        pgid = os.getpgid(0)
        procs = []
        procs.extend([subprocess.Popen(program, close_fds=True, shell=True)
                      for program in PROGRAMS])
        signal.signal(signal.SIGTERM, lambda *args: killpg(pgid))
        signal.signal(signal.SIGHUP, lambda *args: killpg(pgid))
        signal.signal(signal.SIGINT, lambda *args: killpg(pgid))

        print('Running on port ' + str(PORT))
        try:
            http_server = WSGIServer(('', PORT), app,
                                     handler_class=WebSocketHandler)
            http_server.serve_forever()
        except socket.error as e:
            print(e)

    DEBUG = True if '--debug' in sys.argv else False
    STAGING = True if '--staging' in sys.argv else False
    CONFIG = 'config.Development' if DEBUG else 'config.Production'
    CONFIG = 'config.Staging' if STAGING else CONFIG
    PORT = 6050
    PROGRAMS = (('sudo nginx -c ${PWD}/nginx.conf'),)
    #PROGRAMS = ('python lxc-monitor.py',
    #            'python docker-monitor.py')
    signal.signal(signal.SIGCHLD, signal.SIG_IGN)

    if DEBUG or STAGING:
        main = lambda: run_with_reloader(run_server)
    else:
        main = run_server
    main()


if __name__ == "__main__":
    main()
