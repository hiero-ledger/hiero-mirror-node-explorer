// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/table-of-contents

describe('TokenInfoCollector', () => {

    const timestamp = "1673974382.950855003"

    it('should display token name', () => {
        cy.visit('mainnet/transaction/' + timestamp)
        cy.url().should('include', '/mainnet/transaction/')

        cy.get('#entityId')
            .find('span')
            .contains("Apollo Dog Test")
    })

})
