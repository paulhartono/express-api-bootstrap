# The instructions for the first stage
FROM node:14.18 as builder

# ARG NODE_ENV=development
# ENV NODE_ENV=${NODE_ENV}


COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "tsconfig.json", ".env.local", "./"]
RUN npm install

COPY src ./src
RUN npm run build

# The instructions for second stage
FROM node:14.18

ENV APP_DIR /app
WORKDIR "${APP_DIR}"

COPY --from=builder node_modules node_modules
COPY --from=builder dist dist

EXPOSE 4000
CMD ["node", "dist/index.js"]
