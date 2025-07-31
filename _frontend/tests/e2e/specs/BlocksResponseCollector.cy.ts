// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/table-of-contents

describe('BlocksResponseCollector', () => {

    const firstTxnInBlock = "1568412925.355652000"
    const lastTxnInBlock = "1568412929.861487000"

    it('should display block 5 for first transaction in block', () => {
        cy.visit('mainnet/transaction/' + firstTxnInBlock)
        cy.url().should('include', '/mainnet/transaction/' + firstTxnInBlock)

        cy.get('#blockNumberValue').contains("5")
    })

    it('should display block 12 for last transaction in block', () => {
        cy.visit('mainnet/transaction/' + lastTxnInBlock)
        cy.url().should('include', '/mainnet/transaction/' + lastTxnInBlock)

        cy.get('#blockNumberValue').contains("5")
    })
})
