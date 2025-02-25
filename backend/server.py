import asyncio
import websockets
import asyncssh
import json
import sys
import signal

class SSHBridge:
    def __init__(self):
        self.ssh_process = None
        self.ssh_writer = None
        self.ssh_reader = None

    async def connect_ssh(self, hostname, username, password=None, key_path=None):
        try:
            if key_path:
                conn = await asyncssh.connect(
                    hostname,
                    username=username,
                    client_keys=[key_path],
                    known_hosts=None  # In production, you should validate known hosts
                )
            else:
                conn = await asyncssh.connect(
                    hostname,
                    username=username,
                    password=password,
                    known_hosts=None  # In production, you should validate known hosts
                )

            self.ssh_process = await conn.create_session()
            self.ssh_writer = self.ssh_process.stdin
            self.ssh_reader = self.ssh_process.stdout

            return True
        except Exception as e:
            print(f"SSH connection error: {str(e)}")
            return False

    async def handle_websocket(self, websocket):
        try:
            # Wait for initial connection message with SSH details
            message = await websocket.recv()
            config = json.loads(message)

            # Connect to SSH server
            success = await self.connect_ssh(
                hostname=config['hostname'],
                username=config['username'],
                password=config.get('password'),
                key_path=config.get('keyPath')
            )

            if not success:
                await websocket.send(json.dumps({
                    'type': 'error',
                    'message': 'Failed to connect to SSH server'
                }))
                return

            await websocket.send(json.dumps({
                'type': 'connected',
                'message': 'Successfully connected to SSH server'
            }))

            # Handle bidirectional communication
            async def send_ssh_output():
                try:
                    while True:
                        if self.ssh_reader:
                            data = await self.ssh_reader.read(1024)
                            if not data:
                                break
                            await websocket.send(data)
                except Exception as e:
                    print(f"Error reading from SSH: {str(e)}")

            async def handle_websocket_input():
                try:
                    while True:
                        data = await websocket.recv()
                        if self.ssh_writer:
                            self.ssh_writer.write(data)
                            await self.ssh_writer.drain()
                except Exception as e:
                    print(f"Error writing to SSH: {str(e)}")

            # Run both tasks concurrently
            await asyncio.gather(
                send_ssh_output(),
                handle_websocket_input()
            )

        except websockets.exceptions.ConnectionClosed:
            print("WebSocket connection closed")
        finally:
            if self.ssh_process:
                self.ssh_process.close()

async def main():
    bridge = SSHBridge()
    
    async with websockets.serve(
        bridge.handle_websocket,
        "localhost",
        3001,
        ping_interval=None  # Disable ping/pong for better performance
    ):
        print("WebSocket server started on ws://localhost:3001")
        
        # Handle graceful shutdown
        loop = asyncio.get_event_loop()
        for signal_name in ('SIGINT', 'SIGTERM'):
            loop.add_signal_handler(
                getattr(signal, signal_name),
                lambda: asyncio.create_task(shutdown(loop))
            )
        
        await asyncio.Future()  # run forever

async def shutdown(loop):
    print("\nShutting down...")
    for task in asyncio.all_tasks():
        task.cancel()
    loop.stop()

if __name__ == "__main__":
    asyncio.run(main())