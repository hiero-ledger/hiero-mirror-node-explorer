// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Hedera Explorer page not found', () => {

    const defaultNetwork = 'mainnet'
    const target = "No page matches the specified URL"

    beforeEach(() => {
        localStorage.removeItem("network")
        cy.visit('/')
        cy.url().should('include', '/' + defaultNetwork + '/home')
    })

    //
    // last used network is undefined
    //

    it('/#/page-not-found (last used network is undefined)', () => {
        cy.visit('page-not-found')
        cy.url().should('include', '/' + defaultNetwork + '/page-not-found')
        cy.contains(target)
    })

    it('/#/testnet/page-not-found (last used network is undefined)', () => {
        cy.visit('testnet/page-not-found')
        cy.url().should('include', '/testnet/page-not-found')
        cy.contains(target)
    })

    it('/#/mainnet/page-not-found (last used network is undefined)', () => {
        cy.visit('mainnet/page-not-found')
        cy.url().should('include', '/mainnet/page-not-found')
        cy.contains(target)
    })

    //
    // last used network is testnet
    //

    it('/#/page-not-found (last used network is testnet)', () => {
        localStorage.setItem("network", "testnet")
        cy.visit('page-not-found')
        cy.url().should('include', '/' + defaultNetwork + '/page-not-found')
        cy.contains(target)
    })

    it('/#/testnet/page-not-found (last used network is testnet)', () => {
        localStorage.setItem("network", "testnet")
        cy.visit('testnet/page-not-found')
        cy.url().should('include', '/testnet/page-not-found')
        cy.contains(target)
    })

    it('/#/mainnet/page-not-found (last used network is testnet)', () => {
        localStorage.setItem("network", "testnet")
        cy.visit('mainnet/page-not-found')
        cy.url().should('include', '/mainnet/page-not-found')
        cy.contains(target)
    })

    //
    // last used network is mainnet
    //

    it('/#/page-not-found (last used network is mainnet)', () => {
        localStorage.setItem("network", "mainnet")
        cy.visit('page-not-found')
        cy.url().should('include', '/' + defaultNetwork + '/page-not-found')
        cy.contains(target)
    })

    it('/#/testnet/page-not-found (last used network is mainnet)', () => {
        localStorage.setItem("network", "mainnet")
        cy.visit('testnet/page-not-found')
        cy.url().should('include', '/testnet/page-not-found')
        cy.contains(target)
    })

    it('/#/testnet/page-not-found (last used network is mainnet)', () => {
        localStorage.setItem("network", "mainnet")
        cy.visit('mainnet/page-not-found')
        cy.url().should('include', '/mainnet/page-not-found')
        cy.contains(target)
    })

})
