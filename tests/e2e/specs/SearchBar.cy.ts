// noinspection DuplicatedCode

// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

import {makeExchangeFormat} from "../TestUtils";

describe('Search Bar', () => {

    beforeEach(() => {
        cy.visit('/mainnet/home')
        cy.url().should('include', '/mainnet/home')
    })

    it('should find the account ID', () => {
        const searchAccount = "0.0.3"
        testBodyV2(
            searchAccount,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false)

        cy.visit('mainnet/account/0.0.4')
        cy.url().should('include', '/mainnet/account/0.0.4')
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
            .should('have.length', 7)
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
        cy.visit('/mainnet/home')
        const searchHash = "0x08e62c0531e603fa6d29930195682e937978d542bd404d490546717bb128da4ec4ed586e6d516735f24049b2c3eb7b20"
        const timestamp = "1674821555.935799283"
        testBodyV2(
            searchHash,
            '/mainnet/transaction/' + timestamp,
            'Transaction ' + timestamp,
            false,
        )
    })

    it('should find the transaction by evm hash', () => {
        cy.visit('/mainnet/home')
        const searchEvmHash = "0x08e62c0531e603fa6d29930195682e937978d542bd404d490546717bb128da4e"
        const timestamp = "1674821555.935799283"
        testBodyV2(
            searchEvmHash,
            '/mainnet/transaction/' + timestamp,
            'Transaction ' + timestamp,
            false,
        )
    })

    it('should find the transaction by timestamp', () => {
        const searchTimestamp = "1674821555.935799283"
        testBodyV2(
            searchTimestamp,
            '/mainnet/transaction/' + searchTimestamp,
            'Transaction ' + searchTimestamp,
            false,
        )
    })

    it('should find the NFT ID', () => {
        const searchNFT = "0.0.1752721"
        testBodyV2(
            searchNFT,
            '/mainnet/token/' + searchNFT,
            'Token ' + searchNFT,
            false)

        cy.visit('mainnet/token/0.0.1751171')
        cy.url().should('include', '/mainnet/token/0.0.1751171')
        testBodyV2(searchNFT,
            '/mainnet/token/' + searchNFT,
            'Token ' + searchNFT,
            false)
    })

    it('should find the token ID', () => {
        const searchToken = "0.0.1738816"
        testBodyV2(
            searchToken,
            '/mainnet/token/' + searchToken,
            'Token ' + searchToken,
            false)

        cy.visit('mainnet/token/0.0.1738807')
        cy.url().should('include', '/mainnet/token/0.0.1738807')
        testBodyV2(
            searchToken,
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

        cy.visit('mainnet/topic/0.0.1744769')
        cy.url().should('include', '/mainnet/topic/0.0.1744769')
        testBodyV2(
            searchTopic,
            '/mainnet/topic/' + searchTopic,
            'Topic ' + searchTopic,
            false)
    })

    it('should find the contract ID', () => {
        const searchContract = "0.0.1077627"
        testBodyV2(
            searchContract,
            '/mainnet/contract/' + searchContract,
            'Contract ' + searchContract,
            false)

        cy.visit('mainnet/contract/0.0.1742018')
        cy.url().should('include', '/mainnet/contract/0.0.1742018')
        testBodyV2(
            searchContract,
            '/mainnet/contract/' + searchContract,
            'Contract ' + searchContract,
            false)
    })

    it('should find the account by public key', () => {
        cy.visit('/mainnet/home')
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
        const searchHexaAlias = "0x12200000fc0634e2ab455eff393f04819efa262fe5e6ab1c7ed1d4f85fbcd8e6e296"
        const searchAccount = "0.0.721838"
        cy.visit('/mainnet/home')
        testBodyV2(
            searchBase32Alias,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false,
        )
        cy.visit('/mainnet/home')
        testBodyV2(
            searchHexaAlias,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false,
        )
    })

    it('should find the account by Ethereum-format alias', () => {
        cy.visit('/mainnet/home')
        const searchAccount = "0.0.721838"
        testBodyV2(
            searchAccount,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false,
        )
    })

    it('should not fail with empty search string', () => {
        cy.visit('/testnet/home')

        cy.get('[data-cy=searchBar]').submit()

        cy.url().should('include', '/testnet/home')
        cy.get('form').get('input').should('be.enabled')
    })

    it('should bring "No result" with unknown ID', () => {
        const unknownID = "42.42.42"
        cy.visit('/testnet/home')
        cy.get('[data-cy=searchBar]').within(() => {
            cy.get('input').type(unknownID)
        })
        cy.get('[data-cy=searchCompleted]')
        cy.get('[data-cy=searchDropdown]').within(() => {
            cy.contains("No match")
        })
    })

    it('should find the account ID with a submit button click', () => {
        const searchAccount = "0.0.3"
        clickTestBodV2(
            searchAccount,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false)

        cy.visit('mainnet/account/0.0.4')
        cy.url().should('include', '/mainnet/account/0.0.4')
        clickTestBodV2(
            searchAccount,
            '/mainnet/account/' + searchAccount,
            'Account ' + searchAccount,
            false)
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

const clickTestBodV2 = (searchString: string,
                        expectedPath: string,
                        expectedTitle: string | null = null,
                        expectTable = false) => {
    cy.get('[data-cy=searchBar]').within(() => {
        cy.get('input').type(searchString)
    })

    cy.get('[data-cy=searchCompleted]')
    cy.get('form > button').click()

    cy.url().should('include', expectedPath)
    cy.get('title').contains(expectedTitle ? expectedTitle : 'No result')
    if (expectTable) {
        cy.get('table')
            .find('tbody tr')
            .should('have.length.gt', 1)
        cy.contains('No Data').should("not.exist")
    }
}
