// SPDX-License-Identifier: Apache-2.0

// https://docs.cypress.io/api/introduction/api.html

import {makeExchangeFormat} from "../TestUtils";

describe('Transaction Navigation', () => {

    it('should navigate from table to transaction details', () => {
        cy.visit('testnet/transactions/')
        cy.url().should('include', '/testnet/transactions')

        cy.get('table')
            .find('tbody tr')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(0)
            .click()
            .then(($id) => {
                // cy.log('Selected transaction Id: ' + $id.text())
                cy.url().should('include', '/testnet/transaction/')
                cy.contains('Transaction ' + $id.text())
            })
    })

    it('should filter table by transaction type', () => {
        const selectType = 'CONTRACTCALL'

        cy.visit('testnet/transactions/')
        cy.url().should('include', '/testnet/transactions')

        cy.get('[data-cy="select-type"]')
            .select(selectType)
            .then(($type) => {
                cy.wrap($type).should('have.value', selectType)
                cy.url().should('include', '/testnet/transactions?type=' + selectType.toLowerCase())
            })

        cy.get('[data-cy="pauseButton"]')
            .click()

        cy.get('[data-cy="playButton"]')
            .click()
    })

    it('should follow links from transaction details', () => {
        const consensusTimestamp = "1674761227.924091003"

        cy.visit('mainnet/transaction/' + consensusTimestamp)
        cy.url().should('include', '/mainnet/transaction/')
        cy.url().should('include', consensusTimestamp)

        cy.get('#operatorAccount')
            .find('a')
            .click()
            .then(($id) => {
                // cy.log('Selected operator Id: ' + $id.text())
                cy.url().should('include', '/mainnet/account/' + $id.text())
                cy.get('title').contains('Account ' + $id.text())
            })

        cy.go('back')
        cy.url().should('include', '/mainnet/transaction/')
        cy.url().should('include', consensusTimestamp)

        cy.get('#nodeAccount')
            .find('a')
            .click()
            .then(($id) => {
                // cy.log('Selected operator Id: ' + $id.text())
                cy.url().should('include', '/mainnet/account/' + $id.text())
                cy.get('title').contains('Account ' + $id.text())
            })

        cy.go('back')
        cy.url().should('include', '/mainnet/transaction/')
        cy.url().should('include', consensusTimestamp)
    })

    it('should follow schedule relationship links', () => {
        const schedulingConsensusTimestamp = "1674825796.070463898"
        const scheduledConsensusTimestamp = "1674825835.244778007"
        const scheduleId = "0.0.1754091"

        const targetURL = 'mainnet/transaction/' + schedulingConsensusTimestamp
        cy.visit(targetURL)
        cy.url().should('include', targetURL)

        cy.get('#scheduledTransactionValue')
            .find('a')
            .click()
            .then(() => {
                cy.url().should('include', '/mainnet/transaction/')
                cy.url().should('include', scheduledConsensusTimestamp)
                cy.get('title').contains('Transaction ' + scheduledConsensusTimestamp)
            })

        cy.get('#scheduleCreateTransaction')
            .find('a')
            .click()
            .then(() => {
                cy.url().should('include', '/mainnet/transaction/')
                cy.url().should('include', schedulingConsensusTimestamp)
                cy.get('title').contains('Transaction ' + schedulingConsensusTimestamp)
            })

        cy.get('#entityIdValue')
            .find('a')
            .click()
            .then(() => {
                cy.url().should('include', '/mainnet/schedule/')
                cy.url().should('include', scheduleId)
                cy.get('title').contains('Schedule ' + scheduleId)
            })
    })

    it('should follow parent/child relationship links', () => {
        const parentConsensusTimestamp = "1674827805.332465003"
        const childConsensusTimestamp = "1674827805.332465004"

        cy.visit('mainnet/transaction/' + parentConsensusTimestamp)
        cy.url().should('include', '/mainnet/transaction/')
        cy.url().should('include', parentConsensusTimestamp)

        cy.get('#childTransactionsValue')
            .find('a')
            .should('have.length', 6)
            .eq(0)
            .click()
            .then(() => {
                // cy.log('Selected operator Id: ' + $id.text())
                cy.url().should('include', '/mainnet/transaction/')
                cy.url().should('include', childConsensusTimestamp)
                cy.get('title').contains('Transaction ' + childConsensusTimestamp)
            })

        cy.get('#parentTransactionValue')
            .find('a')
            .click()
            .then(() => {
                // cy.log('Selected operator Id: ' + $id.text())
                cy.url().should('include', '/mainnet/transaction/')
                cy.url().should('include', parentConsensusTimestamp)
                cy.get('title').contains('Transaction ' + parentConsensusTimestamp)
            })
    })

    it('should follow link "Transactions with same ID"', () => {
        const timestamp = "1674505116.619586693"
        const transactionId = "0.0.995584@1674505107.270597663"

        cy.visit('mainnet/transaction/' + timestamp)
        cy.url().should('include', '/mainnet/transaction/' + timestamp)

        cy.get('#allTransactionsLink')
            .contains('Transactions with same ID')
            .click()

        cy.url().should('include', '/mainnet/transactionsById/' + makeExchangeFormat(transactionId))
        cy.contains('Transactions with ID ' + transactionId)

        cy.get('table')
            .find('tbody tr')
            .should('have.length.at.least', 2)
            .eq(0)
            .find('td')
            .eq(0)
            .click()

        cy.url().should('include', '/mainnet/transaction/')
        cy.contains('Transaction ' + transactionId)
    })

    it('should switch format of transaction ID', () => {
        const timestamp = "1674505116.619586693"
        const transactionId = "0.0.995584@1674505107.270597663"

        cy.visit('mainnet/transaction/' + timestamp)
        cy.url().should('include', '/mainnet/transaction/' + timestamp)

        cy.contains('Transaction ' + transactionId)

        cy.get('[data-cy="select-format"]')
            .select('dashForm')
            .then(($type) => {
                cy.wrap($type).should('have.value', 'dashForm')
                cy.contains('Transaction ' + makeExchangeFormat(transactionId))
            })

        cy.get('[data-cy="select-format"]')
            .select('atForm')
            .then(($type) => {
                cy.wrap($type).should('have.value', 'atForm')
                cy.contains('Transaction ' + transactionId)
            })
    })

    it('should handle ETHEREUMTRANSACTION type', () => {
        const parentConsensusTimestamp = "1674505116.619586691"
        const childConsensusTimestamp = "1674505116.619586692"
        const contractId = "0.0.1718841"

        const targetURL = 'mainnet/transaction/' + parentConsensusTimestamp
        cy.visit(targetURL)
        cy.url().should('include', targetURL)

        cy.get('#transactionTypeValue')
            .should('contain', "ETHEREUM TRANSACTION")
        cy.get('#entityIdName')
            .should('contain', "Contract ID")

        cy.get('#entityIdValue')
            .find('a')
            .should('have.length', 1)
            .eq(0)
            .click()
            .then(() => {
                // cy.log('Selected operator Id: ' + $id.text())
                cy.url().should('include', '/mainnet/contract/')
                cy.url().should('include', contractId)
                cy.get('title').contains('Contract ' + contractId)
            })
        cy.go('back')

        cy.get('#childTransactionsValue')
            .find('a')
            .should('have.length', 4)
            .eq(0)
            .click()
            .then(() => {
                // cy.log('Selected operator Id: ' + $id.text())
                cy.url().should('include', '/mainnet/transaction/')
                cy.url().should('include', childConsensusTimestamp)
                cy.get('title').contains('Transaction ' + childConsensusTimestamp)
            })

        cy.get('#parentTransactionValue')
            .find('a')
            .click()
            .then(() => {
                // cy.log('Selected operator Id: ' + $id.text())
                cy.url().should('include', '/mainnet/transaction/')
                cy.url().should('include', parentConsensusTimestamp)
                cy.get('title').contains('Transaction ' + parentConsensusTimestamp)
            })
    })

    it('should detect navigation to unknown transaction ID', () => {
        const unknownTimestamp = "2050446896.868427600"
        const targetURL = 'testnet/transaction/' + unknownTimestamp
        cy.visit(targetURL)
        cy.url().should('include', targetURL)
        cy.contains('Transaction')

        cy.get('[id=notificationBanner]')
            .find('div')
            .contains('Transaction with timestamp ' + unknownTimestamp + ' was not found')
    })

    it('should change the table page size', () => {

        cy.visit('testnet/transactions/')
        cy.url().should('include', '/testnet/transactions')

        cy.get('table')
            .find('tbody tr')
            .should('have.length', 15)

        cy.get('[data-cy="select-page-size"]')
            .select('5')
            .then(($type) => {
                cy.wrap($type).should('have.value', '5')
            })

        cy.get('table')
            .find('tbody tr')
            .should('have.length', 5)

        cy.get('[data-cy="select-page-size"]')
            .select('50')
            .then(($type) => {
                cy.wrap($type).should('have.value', '50')
            })

        cy.get('table')
            .find('tbody tr')
            .should('have.length', 50)

    })

})
