// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

import {makeExchangeFormat} from "../TestUtils";

describe('Search Bar', () => {

    beforeEach(() => {
        cy.viewport(700, 800)
        cy.visit('/mainnet/transactions')
        cy.url().should('include', '/mainnet/transactions')
        cy.get('[data-cy="mobile-search-button"]').click()
        cy.url().should('include', '/mainnet/transactions')
    })

    it('should find the account ID', () => {
        const searchAccount = "0.0.3"
        testBodyV2(
            searchAccount,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false)
    })

    it('should find the transaction ID', () => {
        const searchTransaction = "0.0.2@1627434000.000000000"
        const timestamp = "1627434006.848027000"
        testBodyV2(
            searchTransaction,
            '/mainnet/transaction/' + timestamp,
            'Transaction ' + timestamp,
            false
        )
    })

    it('should find and list the scheduling/scheduled transactions', () => {
        const searchTransaction = "0.0.1407723@1674820202.780744468"
        testBodyV2(
            searchTransaction,
            '/mainnet/transactionsById/' + makeExchangeFormat(searchTransaction),
            'Transactions with ID ' + searchTransaction,
        )
        cy.get('table')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length', 2)
            .eq(0)
            .find('td')
            .eq(3)
            .should('contain', 'Schedule Create')  // criteria to check
        cy.get('table')
            .find('tbody tr')
            .eq(1)
            .find('td')
            .eq(3)
            .should('contain', 'Scheduled')  // criteria to check
    })

    it('should find and list the parent/child transactions', () => {
        const searchTransaction = "0.0.445590@1674821543.265349407"
        testBodyV2(
            searchTransaction,
            '/mainnet/transactionsById/' + makeExchangeFormat(searchTransaction),
            'Transactions with ID ' + searchTransaction,
        )
        cy.get('table')
            .find('tbody tr')
            .should('be.visible')
            .should('have.length', 5)
            .eq(0)
            .find('td')
            .eq(3)
            .should('contain', 'Parent')  // criteria to check
        cy.get('table')
            .find('tbody tr')
            .eq(1)
            .find('td')
            .eq(3)
            .should('contain', 'Child')  // criteria to check
        cy.get('table')
            .find('tbody tr')
            .eq(2)
            .find('td')
            .eq(3)
            .should('contain', 'Child')  // criteria to check
    })

    it('should find the transaction by hash', () => {
        const searchHash = "0x08e62c0531e603fa6d29930195682e937978d542bd404d490546717bb128da4ec4ed586e6d516735f24049b2c3eb7b20"
        const timestamp = "1674821555.935799283"
        testBodyV2(
            searchHash,
            '/mainnet/transaction/' + timestamp,
            'Transaction ' + timestamp,
            false
        )
    })

    it('should find the transaction by timestamp', () => {
        const searchTimestamp = "1674821555.935799283"
        testBodyV2(
            searchTimestamp,
            '/mainnet/transaction/' + searchTimestamp,
            'Transaction ' + searchTimestamp,
            false
        )
    })

    it('should find the NFT ID', () => {
        const searchNFT = "0.0.1752721"
        testBodyV2(
            searchNFT,
            '/mainnet/token/' + searchNFT,
            'Token ' + searchNFT,
            false)
    })

    it('should find the token ID', () => {
        const searchToken = "0.0.1738816"
        testBodyV2(searchToken,
            '/mainnet/token/' + searchToken,
            'Token ' + searchToken,
            false)
    })

    it('should find the topic ID', () => {
        const searchTopic = "0.0.1750326"
        testBodyV2(
            searchTopic,
            '/mainnet/topic/' + searchTopic,
            'Topic ' + searchTopic,
            false)
    })

    it('should find the contract ID', () => {
        const searchContract = "0.0.1077627"
        testBodyV2(searchContract,
            '/mainnet/contract/' + searchContract,
            'Contract ' + searchContract,
            false)
    })

    it('should find the account by public key', () => {
        const searchKey = "0x02e783457e4d054db3c7850c2dc83e458a13b210fca75984bc7cfb0fae7343ff60"
        const searchAccount = "0.0.1753997"
        testBodyV2(
            searchKey,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false,
        )
    })

    it('should find the account by public-key-format alias', () => {
        const searchBase32Alias = "CIQAAAH4AY2OFK2FL37TSPYEQGPPUJRP4XTKWHD62HKPQX543DTOFFQ"
        const searchAccount = "0.0.721838"
        testBodyV2(
            searchBase32Alias,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false,
        )
    })

    it('should find the account by Ethereum-format alias', () => {
        const searchAlias = "0x00000000000000000000000000000000000b03ae"
        const searchAccount = "0.0.721838"
        testBodyV2(
            searchAlias,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false,
        )
    })

    it('should not fail with empty search string', () => {
        cy.get('[data-cy=searchBar]').submit() // => replaces search field by search button
        cy.get('[data-cy="mobile-search-button"]')
        cy.url().should('include', '/mainnet/transactions')
    })

    it('should bring "No result" with unknown ID', () => {
        const unknownID = "42.42.42"
        cy.get('[data-cy=searchBar]').within(() => {
            cy.get('input').type(unknownID)
        })
        cy.get('[data-cy=searchCompleted]')
        cy.get('[data-cy=searchBar]').submit()
        cy.get('[data-cy=searchDropdown]').within(() => {
            cy.contains("No match")
        })
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

