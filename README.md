# xcentral-node-graphql

Represent [Xentral APIs](https://github.com/xentral-erp-software-gmbh/xentral) as graphql queries written with node.js

# Run development environment locally

- Clone the repo.
- Install dependencies using `yarn` or `npm i`.
- Run the server using `yarn dev`.

If all steps correct, then you should see the following log:

```bash
🛡️ ############################################🛡️

 ℹ️  Server is listening to:

	 🚀 192.168.0.94
	 🔨 Build ver: 0.0.1
	 📳 Development mode


 ℹ️  Server end-points:

	 ⚙️  http://localhost:9000/changelog
	 ⚙️  http://localhost:9000/v1/graphql

🛡️ ############################################🛡️
```

# Run development environment with docker

- Install `docker` and `docker-compose`
- Run the following commend for **development** `docker-compose -f docker-compose.yml up`
- Run the following commend for **production** `docker-compose -f docker-compose.prod.yml up`

PS: You have to change `XENTRAL_BASE_API` in `src/config/environment` in order to bind your graphql with APIs.

# Building

- Run `yarn build` or `npm run build`.
- Then you can run the build version using `yarn start` or `npm run start`.

If all steps correct, then you should see the following log:

```bash
🛡️ ############################################🛡️

 ℹ️  Server is listening to:

	 🔨 Build ver: 0.0.1
	 📳 Production mode

ℹ️  Server end-points:

	 ⚙️  http://localhost:9000/changelog


🛡️ ############################################🛡️
```

# Testing

You can test the application by running `yarn test` or `npm run test`. When finished, it will generate `coverage` statistics.

If you want to work with testing, it is better to run `yarn test:debug` or `npm run test:debug`. This script is running in `watch mode` using `--verbose` flag to show more testing details with no `coverage` table.

We use two type of testing to insure code quality:

- Unit test.
- Integration test.

## Unit test

Unit test is used to check all internal data source functionality. It is mocking parts of the code and tested according to some specification. All unit test will prefixed with `[UT]` to distinguish between tests.

## Integration test

Apollo server has it's own functionality to mock resolvers. The test is checking if apollo client responding correctly to the query that we pass via `POST` method. All integration test will prefixed with `[IT]`.

Integration test is a good source of app specifications.

To lean more about integration test check their [documentation](https://www.apollographql.com/docs/apollo-server/testing/testing/)

# Versioning

Please follow the following versioning steps for better documentation and changelog.

We have 3 major commits:

- **feature:** - for new feature.
- **fix:** - for hotfix, bugfix and others.
- **break:** - for breaking changes.

_Examples:_

- **fix:** \[#TASK_ID_CLICKUP\] Created changelog for app **(#COMMMIT_SHA)**
- **feature:** \[#TASK_ID_CLICKUP\] Created changelog for app **(#COMMMIT_SHA)**
- **break:** \[#TASK_ID_CLICKUP\] Created changelog for app **(#COMMMIT_SHA)**

By doing the following commits structure, **changelog.md** will auto update due to the `auto-changelog` library.

Juhuuuu!!! you deserve a cup of coffee ☕
