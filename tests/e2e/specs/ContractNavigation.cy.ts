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
            .click()
            .then(($id) => {
                // cy.log('Selected account Id: ' + $id.text())
                cy.url().should('include', '/testnet/contract/' + $id.text())
                cy.contains('Contract ID ' + $id.text())
            })
    })

    it('should follow links from contract details', () => {
        const contractId = "0.0.1186129"

        cy.visit('mainnet/contract/' + contractId)
        cy.url().should('include', '/mainnet/contract/' + contractId)
        cy.contains('Contract ID ' + contractId)

        cy.get('#contract-results-table').contains('td', '0x')
            .click()
        cy.url().should('include', '/mainnet/transaction/')
        cy.contains('Transaction')
        cy.contains('CONTRACT CALL')
        cy.contains(contractId)

        cy.get('#blockNumber')
            .find('a')
            .click()
            .then(($number) => {
                cy.log('Selected block number: ' + $number.text())
                cy.url().should('include', '/mainnet/block/' + $number.text())
                cy.contains('Block ' + $number.text())
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
