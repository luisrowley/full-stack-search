# Accommodation Search

## Technical Coding Test

This project has a simple setup with an api, hooked up to MongoDB and a frontend piece initiated with [vite](https://vitejs.dev/).

## Install and run

From the project root:

```
npm install
```

### Run

Once install has finished, you can use the following to run both the API and UI:

```
npm run start
```

### API

To run the API separately, navigate to the `./packages/api` folder

```
$ cd packages/api
```

And run the `api` server with

```
$ npm run dev
```

The API should start at http://localhost:3001

### Client

To run the `client` server separately, navigate to the `./packages/client` folder

```
$ cd ./packages/client
```

And run the `client` with

```
$ npm run start
```

The UI should start at http://localhost:3000

### Database connection & environment variables

By default, the code is set up to start and seed a MongoDB in-memory server, which should be sufficient for the test. The database URL will be logged on startup, and the seed data can be found at ./packages/api/db/seeds.

If this setup does not work for you or if you prefer to use your own MongoDB server, you can create a .env file. In the ./packages/api folder, create a .env file (or rename the existing .env.sample) and fill in the environment variables.

## Task at hand

When the project is up and running, you should see a search-bar on the screen. This one is currently hooked up to the `/hotels` endpoint.
When you type in a partial string that is part of the name of the hotel, it should appear on the screen.
Ie. type in `resort` and you should see some Hotels where the word `resort` is present.

You will also see 2 headings called **"Countries"** and **"Cities"**.

The assignment is to build a performant way to search for Hotels, Cities or Countries.
Partial searches will be fine. Hotels will need to filterable by location as well.
Ie. The search `uni` should render

- Hotels that are located in the United States, United Kingdom or have the word `uni` in the hotel name.
- Countries that have `uni` in their name Ie. United States, United Kingdom
- No Cities as there is no match

Clicking the close button within the search field should clear out the field and results.

When clicking on one of the `Hotels`, `Cities` or `Countries` links, the application should redirect to the relevant page and render the selected `Hotel`, `City` or `Country` as a heading.

### Limitations

Given the time constraints, we do not expect a fully production-ready solution. We're primarily interested in the approach and the overall quality of the solution.
Feel free to modify the current codebase as needed, including adding or removing dependencies.
For larger or more time-intensive changes, you're welcome to outline your ideas in the write-up section below and discuss them further during the call.

<img src="./assets/search-example.png" width="400px" />

### Write-up

This section provides a comprehensive list of all the major changes made to the project. Specific details are outlined in the following sections of this document:

1. **General refactor of front-end structure**

Originally, the project followed a monolithic approach, with almost all client logic residing in App.tsx. To improve maintainability and modularity, a new file structure was introduced.

Proper separation of concerns was made by organising code into dedicated folders for:

- Components
- Pages
- Types
- Constants
- Services

The view layer is now divided between two main components (pages):

- `Home`
- `SearchDetails`

This restructuring makes the codebase more readable, scalable, and easier to maintain.

2. **Navigation stack at root level**

As part of the requirements were to implement navigation from the main view to a details page, this feature was implemented using "`react-router-dom`". This navigation is bidirectional, allowing the user to go back and forth between the main and the details page.

3. **Extracted API Calls into a Service Layer**

Applying a separated service layer makes react components leaner. In this case the dedicated logic to fetch hotels from the API was moved to its own file at `services/hotelService.ts` so that the main "Home" component is in charge of just rendering the view. This also allows easier testing and mocking of the API calls.

4. **Backend refactor and encapsulation**

Separated backend logic into functions for better reusability and easier testing. Added constants for key connection parameters.

#### UX improvements

- Introduced a loading spinner for cases in which a query to an external server may take longer.
- Click-to-clear search field and results: Implemented a clear button that resets the search.
- ShowClearBtn state was redundant since we can conditionally show or hide the clear button based on the presence of a search term state.

#### Performance Optimizations

- One of the main performance bottlenecks was lacking support for query parameters and relying all filtering on the client. This was solved by implementing a query parameter for seach. This allows filtering hotels by name (e.g. `/hotels?search=resort`) reducing the amount of data sent to the client.

- A debouncing mechanism was implemented to avoid sending a new request for each key stroke in the search input.

- Whenver possible it would be good practice to avoid loading Bootstrap CSS from an external CDN. This posses both security and stability risks, as we cannot guarantee the uptime of the CDN resource or connectivity issues. Instead a better approach would be to have it as a dependency of the project to be installed (npm package for instance).

- In a real-world scenario implementing caching for search results in the backend can significantly enhance performance and reduce unnecessary database queries. For this exercise a minimal caching implementation was provided using "node-cache", which can be enhanced in the future for accomodating partial query matches. Also a middleware layer could be applied instead of relying on specific endpoints for a more general approach.

- Client-side caching should also be considered in order to prevent unnecessary calls to the API for resources that have already been fetched. For this purpose, we can consider an asynchronous state management tool like [Tanstack Query](https://tanstack.com/query/latest) that allows to also keep track of pending and loading states out of the box.

- A rate-limiter should also be considered for limiting API requests from given IP addresses to a certain maximum value. This could also be implemented as a middleware with a config file for setting specific limits per each endpoint. With this solution we provide a first layer of protection against DDOS attacks to our services.

- Regex queries were implemented as a solution to partial matches given the relatively small size of the collections, but this is not the most performant approach for large datasets. While indexed queries would pose the problem of being limited to prefix and exact matches, a tool like ElasticSearch would accomodate partial matches and provide a more scalable alternative.

### Other improvements

#### Database connection

- **Uses a module-scoped MongoClient** → Ensures a single database connection instance avoiding reconnecting on every request.
- **Error Handling & Logging** → Improved clarity on failures and successes.
- **Prevents Memory Leaks** → Ensures the in-memory DB shuts down cleanly on exit (SIGTERM)
- **Security-wise**, input sanitisation was implemented both at the FE and BE level.

#### Filtering efficiency

The filter object dynamically changes based on whether the search variable contains a value.

- If search is provided, it constructs a filter using $or, allowing a case-insensitive partial match against hotel_name, country, or city.

#### Unit and e2e tests

Testing has been added to both the client and the API side.

For running the tests for the client, you can simply run:

```bash
npm run test
```

A custom script has been added to `package.json` to add suport for API unit tests:

```bash
npm run test:api
```

### Production readiness

For **Production** deployments a suitable **release plan** should be considered, including:

1. Expanding existing unit, integration and e2e tests.
2. Chaos Testing: Simulating failure scenarios to test the service's resilience.
3. CI/CD Pipeline setup: with code linting, static analysis, unit and integration tests steps.
4. Monitoring and Observability of the services (e.g.: Prometheus metrics and Grafana dashboards).
5. Post-release plan: deploying the service gradually by different regions (e.g.: EU, US, AP)
6. Alerting mechanisms for key metrics, e.g.: High latency, error rates surpassing a set threshold.
7. Auto-Rollback to revert to the previous version if the error rates or latency surpasses certain limits.
8. Scalability: Setting auto-scaling based on traffic or CPU/memory usage for the service (AWS Auto Scaling).

#### Hotels Collection

```json
[
  {
    "chain_name": "Samed Resorts Group",
    "hotel_name": "Sai Kaew Beach Resort",
    "addressline1": "8/1 Moo 4 Tumbon Phe Muang",
    "addressline2": "",
    "zipcode": "21160",
    "city": "Koh Samet",
    "state": "Rayong",
    "country": "Thailand",
    "countryisocode": "TH",
    "star_rating": 4
  },
  {
    /* ... */
  }
]
```

#### Cities Collection

```json
[
  { "name": "Auckland" },
  {
    /* ... */
  }
]
```

#### Countries Collection

```json
[
  {
    "country": "Belgium",
    "countryisocode": "BE"
  },
  {
    /* ... */
  }
]
```
