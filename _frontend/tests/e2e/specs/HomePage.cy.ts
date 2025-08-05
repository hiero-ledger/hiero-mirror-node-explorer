// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Hedera Explorer home page', () => {

    const defaultNetwork = 'mainnet'

    it('Visits the app root URL', () => {
        cy.visit('/')
        cy.url().should('include', '/' + defaultNetwork + '/home')
        cy.contains('Transactions Over Time')
        cy.contains('Network Fees')
        cy.contains('Active Accounts')
    })
    it('Visits the /network URL', () => {
        cy.visit('/' + defaultNetwork)
        cy.url().should('include', '/' + defaultNetwork + '/home')
        cy.contains('Transactions Over Time')
        cy.contains('Network Fees')
        cy.contains('Active Accounts')
    })
    it('Visits an old hash-based URL', () => {
        cy.visit('/#/testnet/token/0.0.48789573')
        cy.url().should('include', '/' + defaultNetwork + '/home')
        cy.contains('Transactions Over Time')
        cy.contains('Network Fees')
        cy.contains('Active Accounts')
    })
})
