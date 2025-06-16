// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Name Service Search', () => {

    beforeEach(() => {
        cy.visit('/mainnet/home')
        cy.url().should('include', '/mainnet/home')
    })

    it('should find account with KNS name', () => {
        const searchName = "hashgraph.hh"
        const searchAccount = "0.0.1273453"
        testBodyV2(
            searchName,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            true
        )
        testBodyV2(
            searchName.toUpperCase(),
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            true
        )
    })

    it('should find account with HNS name', () => {
        const searchName = "hashgraph.hbar"
        const searchAccount = "0.0.944899"
        testBodyV2(
            searchName,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false
        )
        testBodyV2(
            searchName.toUpperCase(),
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false
        )
    })
})

const testBodyV2 = (searchString: string,
                    expectedPath: string,
                    expectedTitle: string | null = null,
                    expectTable = false) => {
    cy.get('[data-cy=searchBar]').within(() => {
        cy.get('input').type(searchString)
    })

    cy.get('[data-cy=searchCompleted]')
    cy.get('[data-cy=searchBar]').submit()

    cy.url().should('include', expectedPath)
    cy.get('title').contains(expectedTitle ? expectedTitle : 'No result')
    if (expectTable) {
        cy.get('table')
            .find('tbody tr')
            .should('have.length.gt', 1)
        cy.contains('No Data').should("not.exist")
    }
}
