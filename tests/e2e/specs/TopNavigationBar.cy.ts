// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Top Navigation Bar', () => {

    const defaultNetwork = 'mainnet'

    beforeEach(() => {
        cy.viewport(2000, 800)
        cy.visit('/')
        cy.url().should('include', '/' + defaultNetwork + '/dashboard')
    })

    it('should switch networks', () => {
        cy.contains('Transactions Over Time')
        cy.contains('Network Fees')
        cy.contains('Active Accounts')

        cy.get('[data-cy="network-selector"]')
            .select('MAINNET')
            .should('have.value', 'mainnet')

        cy.url().should('include', '/mainnet/dashboard')
        cy.contains('Transactions Over Time')
        cy.contains('Network Fees')
        cy.contains('Active Accounts')

        cy.get('[data-cy="network-selector"]')
            .select('TESTNET')
            .should('have.value', 'testnet')

        cy.url().should('include', '/testnet/dashboard')
        cy.contains('Transactions Over Time')
        cy.contains('Network Fees')
        cy.contains('Active Accounts')

        cy.get('[data-cy="network-selector"]')
            .select('PREVIEWNET')
            .should('have.value', 'previewnet')

        cy.url().should('include', '/previewnet/dashboard')
    })

    it('should navigate to top level pages', () => {
        cy.contains('Transactions').click()
        cy.contains('Recent Transactions')

        cy.contains('Tokens').click()
        cy.contains('Recent NFTs')
        cy.contains('Recent Fungible Tokens')

        cy.contains('Topics').click()
        cy.contains('Recent Topics')

        cy.contains('Contracts').click()
        cy.contains('Recent Contracts')

        cy.contains('Accounts').click()
        cy.contains('Recent Accounts')

        cy.contains('Nodes').click()
        cy.contains('Network')
        cy.contains('Nodes')

        cy.contains('Staking').click()
        cy.contains('My Staking')
        cy.contains('Rewards Estimator')

        cy.contains('Blocks').click()
        cy.contains('Blocks')

        cy.contains('Dashboard').click()
        cy.contains('Transactions Over Time')
        cy.contains('Network Fees')
        cy.contains('Active Accounts')
    })

})
