// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Contract Navigation', () => {

    it('should navigate from table to contract details', () => {
        cy.visit('testnet/contracts/')
        cy.url().should('include', '/testnet/contracts')
        cy.contains('Recent Contracts')

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
            cy.url().should('include', '/testnet/contract/' + text)
            cy.contains('Contract ID ' + text)
        })
    })

    it('should follow links from contract details', () => {
        const contractId = "0.0.1186129"

        cy.visit('mainnet/contract/' + contractId)
        cy.url().should('include', '/mainnet/contract/' + contractId)
        cy.contains('Contract ID ' + contractId)

        cy.get('#tab-ContractDetailsCalls')
            .click()

        cy.get('#contract-results-table').contains('td', '0x')
            .click()
        cy.url().should('include', '/mainnet/transaction/')
        cy.contains('Transaction')
        cy.contains('CONTRACT CALL')
        cy.contains(contractId)

        cy.get('#blockNumber')
            .find('a')
            .then(($id) => {
                cy.wrap($id).as('targetId')
                const text = $id.text().trim()
                cy.wrap(text).as('text')
            })

        cy.get('@targetId').click()
        cy.get('@text').then((text) => {
            cy.url().should('include', '/mainnet/block/' + text)
            cy.contains('Block ' + text)
        })
    })

    it('should display contract details using contract ID', () => {
        const contractId = "0.0.1186129"
        cy.visit('mainnet/contract/' + contractId)
        cy.url().should('include', '/mainnet/contract/' + contractId)
        cy.contains('Contract ID ' + contractId)
    })

    it('should display contract details using contract evm address', () => {
        const contractId = "0.0.1186129"
        const evmAddress = "0x0000000000000000000000000000000000121951"

        cy.visit('mainnet/contract/' + evmAddress)
        cy.url().should('include', '/mainnet/contract/' + evmAddress)
        cy.contains('Contract ID ' + contractId)
    })

    it('should detect navigation to unknown contract ID', () => {
        const unknownID = '9.9.9'
        cy.visit('testnet/contract/' + unknownID)
        cy.url().should('include', '/testnet/contract/' + unknownID)
        cy.contains('Contract')

        cy.get('[id=notificationBanner]')
            .find('div')
            .contains('Contract with ID ' + unknownID + ' was not found')
    })

})
