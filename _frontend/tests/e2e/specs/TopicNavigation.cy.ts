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
            .then(($id) => {
                cy.wrap($id).as('targetId')
                const text = $id.text().trim()
                cy.wrap(text).as('text')
            })

        cy.get('@targetId').click()
        cy.get('@text').then((text) => {
            cy.url().should('include', '/testnet/topic/' + text)
            cy.contains('Topic ' + text)
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
            .then(($id) => {
                cy.wrap($id).as('topicId')
                const text = $id.text().trim()
                cy.wrap(text).as('topicText')
            })

        cy.get('@topicId').click()
        cy.get('@topicText').then((text) => {
            cy.url().should('include', '/mainnet/topic/' + text)
            cy.contains('Topic ' + text)
        })

        cy.get('#tab-TopicDetails_Messages')
            .click()

        cy.get('table')
            .find('tbody tr')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(0)
            .then(($seqNumber) => {
                cy.wrap($seqNumber).as('seqNumber')
                const text = $seqNumber.text().trim()
                cy.wrap(text).as('seqNumberText')
            })

        cy.get('@seqNumber').click()
        cy.url().should('include', '/mainnet/transaction/')

        cy.get('@topicText').then((text) => {
            cy.contains('Topic ID' + text)
        })

        cy.get('#tab-TransactionDetails_Message')
            .click()
        cy.contains('Message Submitted')
        cy.get('@seqNumberText').then((text) => {
            cy.contains('Sequence Number' + text)
        })
    })
})
