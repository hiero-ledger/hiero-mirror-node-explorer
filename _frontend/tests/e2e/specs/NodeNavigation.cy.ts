// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Node Navigation', () => {

    it('should navigate from node table to node details', () => {
        cy.visit('testnet/nodes/')
        cy.url().should('include', '/testnet/nodes')
        cy.contains('Overview')
        cy.contains('Consensus nodes')
        cy.contains('Block nodes')
        cy.contains('Mirror nodes')
        cy.contains('JSON-RPC relays')

        cy.get('#tab-Network_ConsensusNodes').click()

        cy.get('table')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length', 7)
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
            cy.url().should('include', '/testnet/node/' + text)
            cy.contains('Node ' + text)
        })
    })

    it('should follow links from node to account', () => {
        const nodeId = "3"
        const nodeAccount = "0.0.6"

        cy.visit('testnet/node/' + nodeId)
        cy.url().should('include', '/testnet/node/')
        cy.contains('Node ' + nodeId)

        cy.get('#nodeAccount')
            .find('a')
            .contains(nodeAccount)
            .click()

        cy.url().should('include', '/testnet/account/' + nodeAccount)
        cy.contains('Account ID ' + nodeAccount)
        // cy.contains('Node ' + nodeId)
    })

})
