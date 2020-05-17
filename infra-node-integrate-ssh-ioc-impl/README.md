
# Actors
pub server: Public server as Wed Dispatcher
pri server: Private servers

# Actions
pub server listen 8080
pub server listen 50004 publish
pub server to map HTTP request to socket.
pri server connect to pub server on 50004 register subsribe
