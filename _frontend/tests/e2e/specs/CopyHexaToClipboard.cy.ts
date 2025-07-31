// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Copy HexaValue to Clipboard', () => {

    beforeEach(() => {
        cy.wrap(Cypress.automation('remote:debugger:protocol', {
            command: 'Browser.grantPermissions',
            params: {
                permissions: ['clipboardReadWrite', 'clipboardSanitizedWrite'],
                // make the permission tighter by allowing the current origin only
                // like "http://localhost:56978"
                origin: window.location.origin,
            },
        }))
    })

    it('should copy the last transaction hash', () => {
        cy.visit('testnet/transactions')
        cy.contains('Transactions')

        cy.get('table')
            .find('tbody tr')
            .should('have.length.at.least', 2)
            .eq(0)
            .click()

        cy.url().should('include', '/testnet/transaction/')
        cy.contains('Transaction ')

        cy.get('#transactionHash')
            .find('#shyCopyButton')
            .should('be.hidden')
            .invoke('show')
            .find('button ')
            .click()

        cy.window().its('navigator.clipboard')
            .then((clipboard) => clipboard.readText())
            .then(($txt) => {
                // cy.log($txt)
                cy.get('#transactionHashValue').should(($hash) => {
                    expect($txt).equal(
                        $hash.text()
                            .replace(/\s/g, "")
                            .substring(0, $txt.length));
                });
            })
    })

})
