// SPDX-License-Identifier: Apache-2.0

describe('Main Dashboard sanity check', () => {

    const defaultNetwork = 'mainnet'

    it('should include the expected high level components', () => {
        cy.visit('/')
        cy.url().should('include', '/' + defaultNetwork + '/home')

        cy.get('.market-dashboard')
            .find('[data-cy="market-dashboard-item"]')
            .should('have.length', 4)

        cy.get('.market-dashboard')
            .find('#crypto-logo')
        cy.get('.market-dashboard')
            .find('.lucide-globe-icon')
        cy.get('.market-dashboard')
            .find('.lucide-arrow-big-up-dash-icon')
        cy.get('.market-dashboard')
            .find('.lucide-coins-icon')

        cy.contains('Network')
        cy.contains('Accounts')

        cy.get('[data-cy="chart-view"]')
            .should('have.length', 3)
            .eq(0)
            .contains("Transactions Over Time")

        cy.get('[data-cy="chart-view"]')
            .eq(1)
            .contains("Network Fees")

        cy.get('[data-cy="chart-view"]')
            .eq(2)
            .contains("Active Accounts")
    })
})
