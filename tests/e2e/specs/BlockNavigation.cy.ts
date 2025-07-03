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
            .click()
            .then(($id) => {
                // cy.log('Selected block number: ' + $id.text())
                cy.url().should('include', '/testnet/block/' + $id.text())
                cy.contains('Block ' + $id.text())
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
            .contains('td', '@').click()
            .then(($id) => {
                // cy.log('Selected transaction ID: ' + $id.text())
                cy.url().should('include', '/testnet/transaction/')
                cy.contains('Transaction ' + $id.text())
                cy.get('#blockNumberValue')
                    .contains(blockNumber)
                    .click()
                    .url().should('include', '/testnet/block/' + blockNumber)
                cy.contains('Block ' + blockNumber)
            })
    })

})
