# evrythng-cli-plugin-reactor-test

Example plugin for the [EVRYTHNG CLI](https://github.com/evrythng/evrythng-cli)
allowing local testing of 
[Reactor](https://developers.evrythng.com/reference/reactor) scripts before
uploading them to the Platform. This allows easier debugging and faster 
iterative development.


## Installation

Simply install alongside the CLI to make the `reactor-test` command available to 
use. Typically this is a global installation:

```
$ npm i -g evrythng-cli-plugin-reactor-test
```


## Configuration

First, use the `create-config` command to create a `config.json` file, which is
used to set the simulated parameters (i.e: the action that was created, or the
Thng property update that occurred):

```
$ evrythng reactor-test create-config
```

The parameters are as follows:

* `apiUrl` - The main EVRYTHNG API URL.

* `function` - The Reactor 
  [event handler](https://developers.evrythng.com/reference/reactor#section-event-types)
  function to simulate.

* `event` - Object describing the `event` parameter passed to a Reactor script
  when it runs. See the appropriate 
  [event type](https://developers.evrythng.com/reference/reactor#section-event-types)
  to see what this should look like.

* `realistic` - Set to `false` to print logs as they occur, and be notified of 
  uncaught exceptions and Promise rejections. Useful for debugging errors
  preventing `done()` from being called.

An example `config.json` for `onActionCreated` is shown below:

```json
{
  "apiUrl": "https://api.evrythng.com",
  "function": "onActionCreated",
  "event": {
    "action": {
      "id": "Uq24ycCsHc6pwHaaaGgEVCqf",
      "createdAt": 1552556638090,
      "customFields": {
        "serials": ["16746837648", "16746837649", "16746837650"]
      },
      "timestamp": 1552556638090,
      "type": "scans",
      "user": "UqfRhpwNc5d2EHaaw3CCdwre",
      "location": {
        "place": "UqfwY2FfBbtHErRwRmEP6aMk",
        "latitude": 42.856556,
        "longitude": 13.766146,
        "position": {
          "type": "Point",
          "coordinates": [
            13.766146,
            42.856556
          ]
        }
      },
      "locationSource": "place",
      "createdByProject": "UqAdfnmQ5Hp8HAaaRmdaRxrp",
      "createdByApp": "U6Cwh3eAmDxecFRww4ycVt3c",
      "collection": "UMk4xq2XpQfbwdawRGD7gb4m"
    }
  },
  "realistic": false
}
```


## Usage

Once `config.json` is set up with the simulation parameters, specify the paths
to the script and the config file along with the appropriate Trusted Application
API Key to run the script locally:

```
$ evrythng reactor-test run $script $config --api-key $trustedAppApiKey
```

For example:

```
$ evrythng reactor-test run ./main.js ./config.json --api-key q2jW93IyxQn4EDr...
```

The script will be run and provided with all the expected global variables that
are usually present in the Reactor environment in the cloud.