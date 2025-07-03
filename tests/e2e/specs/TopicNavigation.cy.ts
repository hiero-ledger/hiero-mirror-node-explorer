// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Topic Navigation', () => {

    it('should navigate from topic table to topic messages', () => {
        cy.visit('testnet/topics/')
        cy.url().should('include', '/testnet/topics')
        cy.contains('Recent Topics')

        cy.get('table')
            .find('tbody tr')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(0)
            .click()
            .then(($id) => {
                // cy.log('Selected topic Id: ' + $id.text())
                cy.url().should('include', '/testnet/topic/' + $id.text())
                cy.contains('Topic ' + $id.text())
            })
    })

    it('should navigate from transaction details to topic message table back to transaction', () => {
        const timestamp = "1673267377.484637167"
        const transactionId = "0.0.1259116@1673267363.615392477"
        const targetURL = '/mainnet/transaction/' + timestamp
        cy.visit(targetURL)
        cy.url().should('include', targetURL)
        cy.contains('Transaction ' + transactionId)

        cy.get('#entityId')
            .find('a')
            .click()
            .then(($topicId) => {
                cy.url().should('include', '/mainnet/topic/' + $topicId.text())
                cy.contains('Topic ' + $topicId.text())

                cy.get('#tab-TopicDetails_Messages')
                    .click()

                cy.get('table')
                    .find('tbody tr')
                    .should('have.length.at.least', 2)
                    .eq(0)
                    .find('td')
                    .eq(0)
                    .click()
                    .then(($seqNumber) => {
                        cy.url().should('include', '/mainnet/transaction/')
                        cy.contains('Topic ID' + $topicId.text())
                        cy.get('#tab-TransactionDetails_Message')
                            .click()
                        cy.contains('Message Submitted')
                        cy.contains('Sequence Number' + $seqNumber.text())
                    })
            })
    })
})
