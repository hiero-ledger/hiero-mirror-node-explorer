// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

describe('Token Navigation', () => {
    //
    // it('should navigate from table to token details', () => {
    //     cy.visit('testnet/tokens/')
    //     cy.url().should('include', '/testnet/tokens')
    //
    //     cy.get('.card-root')
    //         .eq(0)
    //         .should('contain', 'Recent NFTs')
    //         .find('table')
    //         .find('tbody tr')
    //         .should('be.visible')
    //         .should('have.length.at.least', 2)
    //         .eq(0)
    //         .find('td')
    //         .eq(0)
    //         .click()
    //         .then(($id) => {
    //             // cy.log('Selected transaction Id: ' + $id.text())
    //             cy.url().should('include', '/testnet/token/' + $id.text())
    //             cy.contains('NFT Collection')
    //             cy.get('title').contains('Token ' + $id.text())
    //         })
    //
    //     cy.go('back')
    //
    //     cy.get('.card-root')
    //         .eq(1)
    //         .should('contain', 'Recent Fungible Tokens')
    //         .find('table')
    //         .find('tbody tr')
    //         .should('be.visible')
    //         .should('have.length.at.least', 2)
    //         .eq(0)
    //         .find('td')
    //         .eq(0)
    //         .click()
    //         .then(($id) => {
    //             // cy.log('Selected transaction Id: ' + $id.text())
    //             cy.url().should('include', '/testnet/token/' + $id.text())
    //             cy.contains('Fungible Token')
    //             cy.get('title').contains('Token ' + $id.text())
    //         })
    // })
    //
    // const nftId = "0.0.1752721"
    // it('should follow links from NFT details', () => {
    //     cy.visit('mainnet/token/' + nftId)
    //     cy.url().should('include', '/mainnet/token/' + nftId)
    //     cy.contains('NFT Collection')
    //     cy.get('title').contains('Token ' + nftId)
    //
    //     cy.get('#createTransactionValue')
    //         cy.contains('@')
    //         .click()
    //         .then( () => {
    //             cy.url().should('include', '/mainnet/transaction/')
    //             cy.contains('Token ID' + nftId)
    //         })
    //
    //     cy.go("back")
    //     cy.url().should('include', '/mainnet/token/' + nftId)
    //
    //     cy.get('#nft-holder-table')
    //         .find('tbody tr')
    //         .should('be.visible')
    //         .should('have.length.at.least', 2)
    //         .eq(0)
    //         .find('td')
    //         .eq(1)
    //         .click()
    //         .then(($id) => {
    //             cy.url().should('include', '/mainnet/token/' + nftId + '/' + $id.text())
    //             cy.contains('Serial #' + $id.text())
    //             cy.contains('NFT Collection')
    //             cy.contains('Owner')
    //             cy.contains('Created')
    //             cy.contains('Modified')
    //             cy.contains('Spender')
    //             cy.contains('Delegating Spender')
    //             cy.contains('Mint Transaction')
    //         })
    // })
    //
    // const tokenId = "0.0.1738807"
    // it('should follow links from fungible token details', () => {
    //     cy.visit('mainnet/token/' + tokenId)
    //     cy.url().should('include', '/mainnet/token/' + tokenId)
    //     cy.contains('Fungible Token')
    //     cy.get('title').contains('Token ' + tokenId)
    //
    //     cy.get('#createTransactionValue')
    //     cy.contains('@')
    //         .click()
    //         .then( () => {
    //             cy.url().should('include', '/mainnet/transaction/')
    //             cy.contains('Token ID' + tokenId)
    //         })
    //
    //     cy.go("back")
    //     cy.url().should('include', '/mainnet/token/' + tokenId)
    //
    //     cy.get('#token-balance-table')
    //         .find('tbody tr')
    //         .should('be.visible')
    //         .should('have.length.at.least', 2)
    //         .eq(0)
    //         .find('td')
    //         .eq(0)
    //         .click()
    //         .then(($id) => {
    //             cy.log('Selected account Id: ' + $id.text())
    //             cy.url().should('include', '/mainnet/account/' + $id.text())
    //             cy.get('title').contains('Account ' + $id.text())
    //         })
    // })
    //
    // it('should detect navigation to unknown token ID', () => {
    //     const unknownID = '9.9.9'
    //     cy.visit('testnet/token/' + unknownID)
    //     cy.url().should('include', '/testnet/token/' + unknownID)
    //     cy.get('title').contains('Token ' + unknownID)
    //
    //     cy.get('[id=notificationBanner]')
    //         .find('div')
    //         .contains('Token with ID ' + unknownID + ' was not found')
    // })
    //
    // const tokenAddress = "0x00000000000000000000000000000000001a8837"
    // it('should follow links from token details using ERC20 address', () => {
    //     cy.visit('mainnet/token/' + tokenAddress)
    //     cy.url().should('include', '/mainnet/token/' + tokenAddress)
    //     cy.contains('Fungible Token')
    //     cy.get('title').contains('Token ' + tokenAddress)
    //
    //     cy.get('#token-balance-table')
    //         .find('tbody tr')
    //         .should('be.visible')
    //         .should('have.length.at.least', 2)
    //         .eq(0)
    //         .find('td')
    //         .eq(0)
    //         .click()
    //         .then(($id) => {
    //             // cy.log('Selected account Id: ' + $id.text())
    //             cy.url().should('include', '/mainnet/account/' + $id.text())
    //             cy.get('title').contains('Account ' + $id.text())
    //         })
    // })

    it('should follow call results link from token details (proxied as contract)', () => {
        const proxiedTokenId = "0.0.781589"
        cy.visit('mainnet/token/' + proxiedTokenId)
        cy.url().should('include', '/mainnet/token/' + proxiedTokenId)
        cy.contains('Fungible Token')
        cy.get('title').contains('Token ' + proxiedTokenId)

        cy.get('#tab-TokenDetails_Others')
            .click()

        cy.get('#contract-results-table')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(0)
            .click()
            .then(() => {
                // cy.log('Selected account Id: ' + $id.text())
                cy.url().should('include', '/mainnet/transaction/')
                cy.contains('CONTRACT CALL')
                cy.contains('Token ID' + proxiedTokenId)
            })

    })

})
