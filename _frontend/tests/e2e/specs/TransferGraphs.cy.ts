// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Transfer Graphs Navigation', () => {

    it('should follow links from Hbar transfer graph', () => {
        const timestamp = "1645611953.351954692"

        const targetURL = 'mainnet/transaction/' + timestamp
        cy.visit(targetURL)
        cy.url().should('include', targetURL)

        cy.get('[data-cy=hbarTransfers]')
            .find('[data-cy=sourceAccount]')
            .then(($account) => {
                cy.wrap($account)
                    .find('a')
                    .click()
                cy.url().should('include', '/mainnet/account/' + $account.text())
                cy.get('title').contains('Account ' + $account.text())
            })

        cy.go('back')

        cy.get('[data-cy=hbarTransfers]')
            .find('[data-cy=destinationAccount]')
            .eq(0)
            .then(($account) => {
                cy.wrap($account)
                    .find('a')
                    .click()
                cy.url().should('include', '/mainnet/account/' + $account.text())
                cy.get('title').contains('Account ' + $account.text())
            })

        cy.go('back')

        cy.get('[data-cy=hbarTransfers]')
            .find('[data-cy=destinationAccount]')
            .eq(1)
            .then(($account) => {
                cy.wrap($account)
                    .find('a')
                    .click()
                cy.url().should('include', '/mainnet/account/' + $account.text())
                cy.get('title').contains('Account ' + $account.text())
            })

    })

    it('should follow links from NFT transfer graph', () => {
        const timestamp = "1645611953.351954692"

        const targetURL = 'mainnet/transaction/' + timestamp
        cy.visit(targetURL)
        cy.url().should('include', targetURL)

        cy.get('[data-cy=nftTransfers]')
            .find('[data-cy=sourceAccount]')
            .then(($account) => {
                cy.wrap($account)
                    .find('a')
                    .click()
                cy.url().should('include', '/mainnet/account/' + $account.text())
                cy.get('title').contains('Account ' + $account.text())
            })

        cy.go('back')

        cy.get('[data-cy=nftTransfers]')
            .find('[data-cy=nft]')
            .then((nft) => {
                cy.wrap(nft)
                    .find('a')
                    .eq(0)
                    .click()
                cy.url().should('include', '/mainnet/token/')
                cy.contains('Token ')
            })

        cy.go('back')

        cy.get('[data-cy=nftTransfers]')
            .find('[data-cy=destinationAccount]')
            .then(($account) => {
                cy.wrap($account)
                    .find('a')
                    .click()
                cy.url().should('include', '/mainnet/account/' + $account.text())
                cy.get('title').contains('Account ' + $account.text())
            })

    })

    it('should follow links from Token transfer graph', () => {
        const timestamp = "1644275573.359523416"

        const targetURL = 'mainnet/transaction/' + timestamp
        cy.visit(targetURL)
        cy.url().should('include', targetURL)

        cy.get('[data-cy=tokenTransfers]')
            .find('[data-cy=sourceAccount]')
            .then(($account) => {
                cy.wrap($account)
                    .find('a')
                    .click({force: true})
                cy.url().should('include', '/mainnet/account/' + $account.text())
                cy.get('title').contains('Account ' + $account.text())
            })

        cy.go('back')

        /*
                cy.get('[data-cy=tokenTransfers]')
                    .find('[data-cy="tokenExtra"]')
                    .eq(0)
                    .then(($token) => {
                        cy.wrap($token)
                            .find('a')
                            .click({force: true})
                            .then(($name) => {
                                cy.url().should('include', '/mainnet/token/')
                                cy.contains('Token ')
                                cy.contains($name.text())
                            })
                    })
        */

        cy.get('[data-cy=tokenTransfers]')
            .find('[data-cy="tokenExtra"]')
            .eq(0)
            .find('a')
            .then(($name) => {
                cy.wrap($name).as('targetToken')
                const text = $name.text().trim()
                cy.wrap(text).as('text')
            })

        cy.get('@targetToken').click({force: true})

        cy.url().should('include', '/mainnet/token/')
        cy.contains('Token ')
        cy.get('@text').then((text) => {
            cy.contains(`${text}`)
        })

        cy.go('back')

        cy.get('[data-cy=tokenTransfers]')
            .find('[data-cy="tokenExtra"]')
            .eq(1)
            .find('a')
            .then(($name) => {
                cy.wrap($name).as('targetToken')
                const text = $name.text().trim()
                cy.wrap(text).as('text')
            })

        cy.get('@targetToken').click({force: true})

        cy.url().should('include', '/mainnet/token/')
        cy.contains('Token ')
        cy.get('@text').then((text) => {
            cy.contains(`${text}`)
        })

        cy.go('back')

        cy.get('[data-cy=tokenTransfers]')
            .find('[data-cy=destinationAccount]')
            .find('a')
            .then(($account) => {
                cy.wrap($account).as('targetAccount')
                const text = $account.text().trim()
                cy.wrap(text).as('text')
            })

        cy.get('@targetAccount').click({force: true})

        cy.get('@text').then((text) => {
            cy.url().should('include', '/mainnet/account/' + text)
            cy.get('title').contains('Account ' + text)
        })
    })
})
