[![OpenSSF Scorecard](https://api.scorecard.dev/projects/github.com/hiero-ledger/hiero-mirror-node-explorer/badge)](https://api.scorecard.dev/projects/github.com/hiero-ledger/hiero-mirror-node-explorer)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/10697/badge)](https://bestpractices.coreinfrastructure.org/projects/10697)
[![License](https://img.shields.io/badge/License-Apache%202.0-blue.svg)](https://opensource.org/licenses/Apache-2.0)

# hiero-ledger/hiero-mirror-node-explorer

Visual Explorer for the Hiero DLT.

### Project setup
`npm install`

### Compile and hot-reload for development
`npm run dev`

### Compile and minify for production
`npm run build`

### Lint files (find and fix problems)
`npm run lint`

### Run unit tests
`npm run test:unit`

### Run end-to-end tests interactively
`npm run test:e2e:dev`

### Run end-to-end tests in headless browser mode
`npm run test:e2e`

## Configuration

The configuration of the explorer is based on these 2 files, which need to be found at the root of the app in order for the
Explorer to start:
- `/public/core-config.json`
- `/public/networks-config.json`

Details for these configuration files can be found in [CONFIGURATION.md](https://github.com/hashgraph/hedera-mirror-node-explorer/blob/main/CONFIGURATION.md).

## Run in Docker

### Build the Docker image (skip to use pre-built image)
`npm run docker:build`

### Copy and adjust configuration of Hiero networks as needed
`cp networks-config-http-example.json networks-config.json`

### Start the Docker container (fetches a pre-built image if not built locally)
`npm run docker:start`

### Launch Explorer
`open http://localhost:8080`

### Stop the Docker container
`npm run docker:stop`


## Run in Kubernetes

To run in [Kubernetes](https://kubernetes.io) the hiero-explorer [Helm](https://helm.sh) chart can be used. First,
obtain access to a Kubernetes cluster running version 1.23 or greater. [Minikube](https://minikube.sigs.k8s.io/docs/)
can be used for a local Kubernetes cluster.

`helm upgrade --install hiero-explorer chart/`

### Configure custom networks 

Core configuration and network configuration need to be provided to the Explorer in the `values.yaml` file 
(see [CONFIGURATION.md](https://github.com/hashgraph/hedera-mirror-node-explorer/blob/main/CONFIGURATION.md) for details on configuration parameters).

The network configuration needs to provide at least the description on one supported networks.

An example:
```
 config: |
  [
    {
      "name": "testnet",
      "displayName": "TESTNET",
      "url": "https://testnet.mirrornode.hedera.com/",
      "ledgerID": "01"
    }
  ]
```

## Testing smart contract verification with a local sourcify server

The default sourcify configuration in `networks-config.json` allows the explorer to contact a local installation of sourcify for verifying contracts.
Note that the production sourcify server will not accept verification requests from an explorer running on localhost.

Use the following commands to use sourcify locally:

`npm run sourcify:setup`: Check environment set-up for running sourcify locally

`npm run sourcify:start`: Start sourcify service. This should open a page saying that the server is alive.

`npm run sourcify:stop`: Stop sourcify service

Please see
[sourcify-setup/README.md](https://github.com/hashgraph/hedera-mirror-node-explorer/blob/main/sourcify-setup/README.md) for more details. 

## Contributing

Contributions are welcome. Please see the
[contributing guide](https://github.com/hashgraph/.github/blob/main/CONTRIBUTING.md)
to see how you can get involved.

## Help/Community

- Join our [community discussions](https://discord.lfdecentralizedtrust.org/) on discord.

## About Users and Maintainers

- Users and Maintainers guidelies are located in **[Hiero-Ledger's roles and groups guidelines](https://github.com/hiero-ledger/governance/blob/main/roles-and-groups.md#maintainers).**

## Code of Conduct

This project is governed by the
[Contributor Covenant Code of Conduct](https://github.com/hashgraph/.github/blob/main/CODE_OF_CONDUCT.md). By
participating, you are expected to uphold this code of conduct. Please report unacceptable behavior
to [oss@hedera.com](mailto:oss@hedera.com).

## License

[Apache License 2.0](LICENSE)
