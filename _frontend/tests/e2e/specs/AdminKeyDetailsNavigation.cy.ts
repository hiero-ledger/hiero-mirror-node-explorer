// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('AdminKeyDetails Navigation', () => {

    it('should follow link from account to admin key details and back', () => {
        const accountId = "0.0.2"

        cy.visit('mainnet/account/' + accountId)
        cy.url().should('include', '/mainnet/account/' + accountId)
        cy.contains('Account ID ' + accountId)

        cy.get('#keyValue')
            .find('a')
            .click()

        cy.url().should('include', '/mainnet/adminKey/' + accountId)
        cy.contains('Admin Key for Account ' + accountId)

        cy.get('#accountId')
            .find('a')
            .click()

        cy.url().should('include', '/mainnet/account/' + accountId)
        cy.contains('Account ID ' + accountId)
    })

    it('should detect navigation to unknown account ID', () => {
        const unknownID = '9.9.9'
        cy.visit('testnet/adminKey/' + unknownID)
        cy.url().should('include', '/testnet/adminKey/' + unknownID)
        cy.contains('Admin Key for Account')

        cy.get('[id=notificationBanner]')
            .find('div')
            .contains('Account with ID ' + unknownID + ' was not found')
    })

    it('should detect navigation to invalid account ID', () => {
        const invalidID = '9.9.9999999999'
        cy.visit('testnet/adminKey/' + invalidID)
        cy.url().should('include', '/testnet/adminKey/' + invalidID)
        cy.contains('Admin Key for Account')

        cy.get('[id=notificationBanner]')
            .find('div')
            .contains('Invalid account ID, address or alias: ' + invalidID)
    })
})
