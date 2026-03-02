FROM node:18-alpine

WORKDIR /app

EXPOSE 3000

CMD ["sh", "-c", "if [ -f package.json ]; then npm install && npm run dev; else echo 'Waiting for Next.js project initialization...' && tail -f /dev/null; fi"]
