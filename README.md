# Humans.

Humans is an application for creating independent profiles on the web as powered by [Blockstack](https://blockstack.org/) and [Ember](https://emberjs.com/).

The app is hosted by its original creator [Mark Hendrickson](https://markmhendrickson.com/) at [https://humans.name](https://humans.name).
Anyone can use that instance for free to create their public profile within minutes while maintaining complete control over profile data with a new or existing Blockstack ID.

Once created, profiles can be shared easily using either the app's provided URL (e.g. [humans.name/markmhendrickson.id](https://humans.name/markmhendrickson.id)) or the domain owned by the user as configured with DNS records (e.g. [human.markmhendrickson.com](http://human.markmhendrickson.com)).

The app's codebase is also available here for hosting and modification by others. Profiles created with one instance of the codebase will become instantly available to all other instances given the distributed identity and storage solutions provided by Blockstack. No particular host will own accounts on behalf of users and data portability is established by design.

Content support is currently quite limited but will expand over time to match the range and capabilities of [Neotoma's personal web app](https://github.com/neotoma/personal-web) as demonstrated by [markmhendrickson.com](https://markmhendrickson.com) and [rachelgillum.com](https://rachelgillum.com).

## Prerequisites

You will need the following things properly installed on your computer.

* [Git](https://git-scm.com/)
* [Node.js](https://nodejs.org/) (with npm)
* [Ember CLI](https://ember-cli.com/)
* [Google Chrome](https://google.com/chrome/)

## Installation

* `git clone <repository-url>` this repository
* `cd humans`
* `npm install`

## Environment variables

The following environment variables are managed by [Park Ranger](https://github.com/markmhx/park-ranger).

These are used for running the app:

* `HUMANS_HOSTNAME` hostname for app (optional, defaults to `localhost`)
* `HUMANS_IP_ADDRESS` IP address for app (optional, defaults to `127.0.0.1`)
* `HUMANS_PORT` port for app (optional, defaults to `4200`)
* `HUMANS_PROTOCOL` protocol for app (optional, defaults to `http`)
* `HUMANS_SEGMENT_WRITE_KEY` [Segment](http://segment.com) write key for app (optional)

These are used for deployment:

* `HUMANS_PRODUCTION_HOSTNAME` hostname for deployed app (required)
* `HUMANS_PRODUCTION_IP_ADDRESS` IP address for deployed app (required)
* `HUMANS_PRODUCTION_PORT` port for deployed app (optional, defaults to `80`)
* `HUMANS_PRODUCTION_PROTOCOL` protocol for deployed app (optional, defaults to `https`)
* `HUMANS_PRODUCTION_SEGMENT_WRITE_KEY` [Segment](http://segment.com) write key for deployed app (optional)
* `HOIST_DEST_DIR` directory for deployment server (required)
* `HOIST_DEST_HOST` host for deployment server (required)
* `HOIST_DEST_USER` user for deployment server (required)

## Running / Development

* `ember serve`
* Visit your app at [http://localhost:4200](http://localhost:4200).
* Visit your tests at [http://localhost:4200/tests](http://localhost:4200/tests).

### Code Generators

Make use of the many generators for code, try `ember help generate` for more details

### Running Tests

* `ember test`
* `ember test --server`

### Linting

* `npm run lint:hbs`
* `npm run lint:js`
* `npm run lint:js -- --fix`

### Building

* `ember build` (development)
* `ember build --environment production` (production)

### Deploying

* `npm run deploy`

## Further Reading / Useful Links

* [ember.js](https://emberjs.com/)
* [ember-cli](https://ember-cli.com/)
* Development Browser Extensions
  * [ember inspector for chrome](https://chrome.google.com/webstore/detail/ember-inspector/bmdblncegkenkacieihfhpjfppoconhi)
  * [ember inspector for firefox](https://addons.mozilla.org/en-US/firefox/addon/ember-inspector/)
