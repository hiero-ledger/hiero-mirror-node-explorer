// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Token Navigation', () => {

    it('should navigate from token table to token details', () => {
        cy.visit('testnet/tokens/')
        cy.url().should('include', '/testnet/tokens')
        cy.contains('Recent Fungible Tokens')

        cy.get('table')
            .find('tbody tr')
            .should('be.visible')
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
            cy.url().should('include', '/testnet/token/' + text)
            cy.contains('Fungible Token')
            cy.get('title').contains('Token ' + text)
        })
    })


    it('should navigate from NFT table to NFT collection details', () => {
        cy.visit('testnet/tokens/')
        cy.url().should('include', '/testnet/tokens')

        cy.get('#tab-Tokens_Nfts').click()
        cy.contains('Recent NFTs')


        cy.get('table')
            .find('tbody tr')
            .should('be.visible')
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
            cy.url().should('include', '/testnet/token/' + text)
            cy.contains('NFT Collection')
            cy.get('title').contains('Token ' + text)
        })
    })

    const nftId = "0.0.1752721"
    it('should follow links from NFT collection details', () => {
        cy.visit('mainnet/token/' + nftId)
        cy.url().should('include', '/mainnet/token/' + nftId)
        cy.contains('NFT Collection')
        cy.get('title').contains('Token ' + nftId)

        cy.get('#createTransactionValue')
            .contains('@')
            .then(($id) => {
                cy.wrap($id).as('targetId')
                const text = $id.text().trim()
                cy.wrap(text).as('text')
            })

        cy.get('@targetId').click()
        cy.get('@text').then((text) => {
            cy.url().should('include', '/mainnet/transaction/')
            cy.get('.title').contains('Transaction ' + text)
        })

        cy.go("back")
        cy.url().should('include', '/mainnet/token/' + nftId)

        cy.get('#tab-TokenDetails_Holders').click()


        cy.get('#nft-holder-table')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(1)
            .then(($id) => {
                cy.wrap($id).as('targetId')
                const text = $id.text().trim()
                cy.wrap(text).as('text')
            })

        cy.get('@targetId').click()
        cy.get('@text').then((text) => {
            cy.url().should('include', '/mainnet/token/' + nftId + '/' + text)
            cy.get('.title').contains('NFT Details')
            cy.contains('Serial #' + text)
            cy.contains('NFT Collection')
            cy.contains('Owner')
            cy.contains('Created')
            cy.contains('Modified')
            cy.contains('Spender')
            cy.contains('Delegating Spender')
            cy.contains('Mint Transaction')
        })
    })

    const tokenId = "0.0.1738807"
    it('should follow links from fungible token details', () => {
        cy.visit('mainnet/token/' + tokenId)
        cy.url().should('include', '/mainnet/token/' + tokenId)
        cy.contains('Fungible Token')
        cy.get('title').contains('Token ' + tokenId)

        cy.get('#createTransactionValue')
            .contains('@')
            .then(($id) => {
                cy.wrap($id).as('targetId')
                const text = $id.text().trim()
                cy.wrap(text).as('text')
            })

        cy.get('@targetId').click()
        cy.get('@text').then((text) => {
            cy.url().should('include', '/mainnet/transaction/')
            cy.get('.title').contains('Transaction ' + text)
        })

        cy.go("back")
        cy.url().should('include', '/mainnet/token/' + tokenId)

        cy.get('#tab-TokenDetails_Holders').click()

        cy.get('#token-balance-table')
            .find('tbody tr')
            .should('be.visible')
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
            cy.url().should('include', '/mainnet/account/' + text)
            cy.get('title').contains('Account ' + text)
        })
    })

    it('should detect navigation to unknown token ID', () => {
        const unknownID = '9.9.9'
        cy.visit('testnet/token/' + unknownID)
        cy.url().should('include', '/testnet/token/' + unknownID)
        cy.get('title').contains('Token ' + unknownID)

        cy.get('[id=notificationBanner]')
            .find('div')
            .contains('Token with ID ' + unknownID + ' was not found')
    })

    const tokenAddress = "0x00000000000000000000000000000000001a8837"
    const ercId = "0.0.1738807"
    it('should follow links from token details using ERC20 address', () => {
        cy.visit('mainnet/token/' + tokenAddress)
        cy.url().should('include', '/mainnet/token/' + tokenAddress)
        cy.contains('Fungible Token')
        cy.get('.title').contains('Token ' + ercId)

        cy.get('#tab-TokenDetails_Holders').click()

        cy.get('#token-balance-table')
            .find('tbody tr')
            .should('be.visible')
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
            cy.url().should('include', '/mainnet/account/' + text)
            cy.get('title').contains('Account ' + text)
        })
    })

    it('should follow call results link from token details (proxied as contract)', () => {
        const proxiedTokenId = "0.0.781589"
        cy.visit('mainnet/token/' + proxiedTokenId)
        cy.url().should('include', '/mainnet/token/' + proxiedTokenId)
        cy.contains('Fungible Token')
        cy.get('title').contains('Token ' + proxiedTokenId)
    })
})
