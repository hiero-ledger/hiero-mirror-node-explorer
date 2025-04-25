// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Hedera Explorer legal notices', () => {

    it('Visits the terms of use notice', () => {
        cy.visit('/testnet')
        cy.url().should('include', '/testnet/dashboard')
        cy.get('[data-cy=termsOfUse]').should('not.exist')
    })

    it('Visits the privacy policy notice', () => {
        cy.visit('/privacy-policy.html')
        cy.url().should('include', '/privacy-policy.html')
    })
})
