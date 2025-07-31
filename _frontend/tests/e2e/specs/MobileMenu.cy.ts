// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Mobile Menu', () => {

    const defaultNetwork = 'mainnet'

    beforeEach(() => {
        cy.viewport(700, 800)
    })

    it('should bring up mobile menu and dismiss it', () => {

        cy.visit('/')
        cy.url().should('include', '/' + defaultNetwork + '/home')
        cy.contains('Transactions Over Time')
        cy.contains('Network Fees')
        cy.contains('Active Accounts')

        cy.get('[data-cy="mobile-menu-icon"]').click()
        cy.url().should('include', '/' + defaultNetwork + '/home')

        cy.get('[data-cy="mobile-menu-content"]').then(() => {
            cy.contains('Home')
            cy.contains('Transactions')
            cy.contains('Tokens')
            cy.contains('Topics')
            cy.contains('Contracts')
            cy.contains('Accounts')
            cy.contains('Nodes')
            cy.contains('Staking')
            cy.contains('Blocks')
        })


        cy.get('[data-cy="mobile-menu-close-icon"]').click()
        cy.url().should('include', '/' + defaultNetwork + '/home')
    })

    it('should switch networks from mobile menu', () => {

        cy.visit('/mainnet/home')
        cy.url().should('include', '/mainnet/home')

        cy.get('[data-cy="mobile-menu-icon"]').click()
        cy.url().should('include', '/' + defaultNetwork + '/home')

        for (const n of ['PREVIEWNET', 'TESTNET', 'MAINNET']) {
            cy.contains(n).click()
            cy.url().should('include', '/' + n.toLowerCase() + '/home')

            cy.get('[data-cy="mobile-menu-icon"]').click()
        }
    })

    it('should navigate to top level pages', () => {

        cy.visit('/')
        cy.url().should('include', '/' + defaultNetwork + '/home')

        cy.get('[data-cy="mobile-menu-icon"]').click()
        cy.url().should('include', '/' + defaultNetwork + '/home')

        for (const p of ['Transactions', 'Tokens', 'Topics', 'Contracts', 'Accounts', 'Nodes', 'Staking', 'Blocks', 'Home']) {
            cy.contains(p).click()
            cy.url().should('include', '/' + defaultNetwork + '/' + p.toLowerCase())

            cy.get('[data-cy="mobile-menu-icon"]').click()
        }
    })

})
