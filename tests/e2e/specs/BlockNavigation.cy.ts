// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Block Navigation', () => {

    it('should navigate from block table to block details', () => {
        cy.visit('testnet/blocks/')
        cy.url().should('include', '/testnet/blocks')
        cy.contains('Blocks')

        cy.get('table')
            .find('tbody tr')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(0)
            .then(($id) => {
                cy.wrap($id).as('targetId')
                const text = $id.text().trim()
                cy.wrap(text).as('text')
            })

        cy.get('@targetId').click()
        cy.get('@text').then((text) => {
            cy.url().should('include', '/testnet/block/' + text)
            cy.contains('Block ' + text)
        })
    })

    it('should navigate from block details to previous block details', () => {
        const blockNumber = "3"
        cy.visit('testnet/block/' + blockNumber)
        cy.url().should('include', '/testnet/block/' + blockNumber)
        cy.contains('Block ' + blockNumber)

        cy.get('#prev-block-button')
            .contains('PREV. BLOCK')
            .click()
        cy.contains('Block ' + (Number(blockNumber) - 1))

        cy.get('#next-block-button')
            .contains('NEXT BLOCK')
            .click()
        cy.contains('Block ' + blockNumber)
    })

    it('should navigate from the list of Block Transactions to TransactionDetails and back', () => {
        const blockNumber = "3"
        cy.visit('testnet/block/' + blockNumber)
        cy.url().should('include', '/testnet/block/' + blockNumber)
        cy.contains('Block ' + blockNumber)

        cy.get('#tab-BlockDetails_Transactions')
            .click()

        cy.get('table')
            .contains('td', '@')
            .then(($id) => {
                cy.wrap($id).as('targetId')
                const text = $id.text().trim()
                cy.wrap(text).as('text')
            })

        cy.get('@targetId').click()
        cy.get('@text').then((text) => {
            cy.url().should('include', '/testnet/transaction/')
            cy.contains('Transaction ' + text)
        })

        cy.get('#blockNumberValue')
            .contains(blockNumber)
            .click()

        cy.url().should('include', '/testnet/block/' + blockNumber)
        cy.contains('Block ' + blockNumber)
    })
})
