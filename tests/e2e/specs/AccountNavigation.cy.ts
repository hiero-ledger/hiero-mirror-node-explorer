// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Account Navigation', () => {

    it('should navigate from table to account details', () => {
        cy.visit('testnet/accounts/')
        cy.url().should('include', '/testnet/accounts')
        cy.contains('Recent Accounts')

        cy.get('table')
            .find('tbody tr')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(0)
            .click()
            .then(($id) => {
                // cy.log('Selected account Id: ' + $id.text())
                cy.url().should('include', '/testnet/account/' + $id.text())
                cy.contains('Account ID ' + $id.text())
            })
    })

    it('should follow links to HTS tokens', () => {
        const accountId1 = "0.0.592746"

        cy.visit('mainnet/account/' + accountId1)
        cy.url().should('include', '/mainnet/account/')
        cy.contains('Account ' + accountId1)

        cy.get('#tab-AccountDetails_Assets').click()

        cy.get('#fungibleTable')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(0)
            .click()
            .then(($id) => {
                cy.url().should('include', `/mainnet/token/${$id.text()}`)
                cy.contains('Fungible Token')
                cy.contains(`${$id.text()}`)
            })

        cy.go('back')
        cy.url().should('include', '/mainnet/account/')
        cy.contains('Account ' + accountId1)

        cy.get('#tab-nfts').click()
        cy.get('#nftsTable')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(1)
            .click()
            .then(($id) => {
                cy.url().should('include', `/mainnet/token/${$id.text()}`)
                cy.contains('NFT Details')
                cy.contains('Non Fungible Token')
                cy.contains('NFT Collection')
                cy.contains(`${$id.text()}`)
            })

        cy.go('back')
        cy.url().should('include', '/mainnet/account/')
        cy.contains('Account ' + accountId1)
    })

    it('should follow link to recent transaction', () => {
        const accountId1 = "0.0.902"

        cy.visit('testnet/account/' + accountId1)
        cy.url().should('include', '/testnet/account/')
        cy.contains('Account ' + accountId1)

        cy.get("#tab-AccountDetails_Operations").click()
        cy.get('#recentTransactionsTable')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(0)
            .click()
            .then(($id) => {
                // cy.log('Selected transaction Id: ' + $id.text())
                cy.url().should('include', '/testnet/transaction/')
                cy.contains('Transaction ' + $id.text())
            })
    })

    it('should follow link to recent created contract', () => {
        const accountID = "0.0.902"
        cy.visit('testnet/account/' + accountID)
        cy.url().should('include', '/testnet/account/' + accountID)
        cy.contains('Account ' + accountID)

        cy.get('#tab-AccountDetails_Operations')
            .click()

        cy.get('#tab-contracts')
            .click()

        cy.get('#recentContractsTable')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(0)
            .click()
            .then(($id) => {
                cy.url().should('include', '/testnet/contract/' + $id.text())
                cy.contains('Contract ' + $id.text())
                cy.contains($id.text())
            })
    })

    it.skip('should follow link to recent reward transaction', () => {
        const accountID = "0.0.592746"
        cy.visit('mainnet/account/' + accountID)
        cy.url().should('include', '/mainnet/account/' + accountID)
        cy.contains('Account ' + accountID)

        cy.get('#tab-AccountDetails_Operations')
            .click()

        cy.get('#tab-rewards')
            .click()

        cy.get('#recentRewardsTable')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(0)
            .click()

        cy.url().should('include', '/mainnet/transaction/')
        cy.contains('Transaction')
        cy.contains('Staking Rewards')
        cy.contains('0.0.800')
        cy.contains(accountID)
    })

    it('should display allowance tables', () => {
        const accountId = "0.0.592746"

        cy.visit('mainnet/account/' + accountId)
        cy.url().should('include', '/mainnet/account/')
        cy.contains('Account ' + accountId)

        cy.get('#tab-AccountDetails_Allowances')
            .click()

        cy.get('#hbarAllowancesTable')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length.at.least', 1)

        cy.get('#tab-token').click()

        cy.get('#tokenAllowancesTable')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length.at.least', 1)

        cy.get('#tab-nft').click()

        cy.get('#nftAllowancesTable')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length.at.least', 1)
    })

    it('should display account details using account ID', () => {
        const accountID = "0.0.592746"
        cy.visit('mainnet/account/' + accountID)
        cy.url().should('include', '/mainnet/account/' + accountID)
        cy.contains('Account ID ' + accountID)
    })

    it('should display account details using account key alias (base32)', () => {
        const accountID = "0.0.721838"
        const accountAlias = "CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ"
        cy.visit('mainnet/account/' + accountAlias)
        cy.url().should('include', '/mainnet/account/' + accountAlias)
        cy.contains('Account ID ' + accountID)
    })

    it('should display account details using account key alias (hexa)', () => {
        const accountID = "0.0.721838"
        const accountAliasInHex = "0x12200000fc0634e2ab455eff393f04819efa262fe5e6ab1c7ed1d4f85fbcd8e6e296"
        cy.visit('mainnet/account/' + accountAliasInHex)
        cy.url().should('include', '/mainnet/account/' + accountAliasInHex)
        cy.contains('Account ID ' + accountID)
    })

    it('should display account details using account evm address', () => {
        const accountID = "0.0.592746"
        const evmAddress = "0x0000000000000000000000000000000000090b6a"

        cy.visit('mainnet/account/' + evmAddress)
        cy.url().should('include', '/mainnet/account/' + evmAddress)
        cy.contains('Account ID ' + accountID)

        // EIP 3091
        cy.visit('mainnet/address/' + evmAddress)
        cy.url().should('include', '/mainnet/account/' + accountID)
        cy.contains('Account ID ' + accountID)
    })

    it('should detect navigation to unknown account ID', () => {
        const unknownID = '9.9.9'
        cy.visit('testnet/account/' + unknownID)
        cy.url().should('include', '/testnet/account/' + unknownID)
        cy.contains('Account')

        cy.get('[id=notificationBanner]')
            .find('div')
            .contains('Account with ID ' + unknownID + ' was not found')
    })

    it('should follow link to associated contract and back', () => {
        const accountId = '0.0.1744776'
        cy.visit('mainnet/account/' + accountId)
        cy.url().should('include', '/mainnet/account/' + accountId)
        cy.contains('Account ID ' + accountId)
        cy.contains('a', "Associated contract")
            .click()

        cy.url().should('include', '/mainnet/contract/' + accountId)
        cy.contains('Contract ID ' + accountId)
        cy.contains('a', "Associated account")
            .click()

        cy.url().should('include', '/mainnet/account/' + accountId)
        cy.contains('Account ID ' + accountId)
    })

    it('should follow link to associated contract and back using evm address', () => {
        const accountID = '0.0.1744776'
        const evmAddress = "0x00000000000000000000000000000000001a9f88"

        cy.visit('mainnet/account/' + evmAddress)
        cy.url().should('include', '/mainnet/account/' + evmAddress)
        cy.contains('Account ID ' + accountID)
        cy.contains('a', "Associated contract")
            .click()

        cy.url().should('include', '/mainnet/contract/' + accountID)
        cy.contains('Contract ID ' + accountID)
        cy.contains('a', "Associated account")
            .click()

        cy.url().should('include', '/mainnet/account/' + accountID)
        cy.contains('Account ID ' + accountID)
    })

    it('should follow link to corresponding node and back', () => {
        const accountId = '0.0.3'
        const nodeId = '0'
        cy.visit('testnet/account/' + accountId)
        cy.url().should('include', '/testnet/account/' + accountId)
        cy.contains('Account ID ' + accountId)
        cy.contains('a', 'node1')
            .click()

        cy.url().should('include', '/testnet/node/' + nodeId)
        cy.contains('Node ' + nodeId)
        cy.contains('a', accountId)
            .click()

        cy.url().should('include', '/testnet/account/' + accountId)
        cy.contains('Account ID ' + accountId)
    })

    it('should not show a link to associated contract', () => {
        const accountId = '0.0.1744776'
        const searchId = '0.0.3'
        cy.visit('mainnet/account/' + accountId)
        cy.url().should('include', '/mainnet/account/' + accountId)
        cy.contains('Account ID ' + accountId)
        cy.contains('a', "Associated contract")

        cy.get('[data-cy=searchBar]').within(() => {
            cy.get('input').type(searchId)
        })
        cy.get('[data-cy=searchCompleted]')
        cy.get('[data-cy=searchBar]').submit()

        cy.url().should('include', '/mainnet/account/' + searchId)
        cy.contains('Account ID ' + searchId)
        cy.contains('a', "Associated contract").should('not.exist')
    })
})
