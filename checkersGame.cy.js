
import actions from "../fixtures/checkers.json"

describe('Checker Game', () => {

    it('Execute assessment script', () => {

        cy.visit('https://www.gamesforthebrain.com/game/checkers/');

        // Confirm that the site is up
        cy.url().should('include', '/game/checkers/');
        cy.get('#message').contains(actions.startAction).should('be.visible');

        //remember initial positions of checkers
        let initialBlueNames, initialOrangeNames;
        cy.get('[src="me1.gif"]').then($blueElements => {
            initialBlueNames = $blueElements.toArray().map(elem => elem.getAttribute('name')).join();
        });
        cy.get('[src="you1.gif"]').then($orangeElements => {
            initialOrangeNames = $orangeElements.toArray().map(elem => elem.getAttribute('name')).join();
        });


        // Making five legal moves as orange'
        moveAndWait('[name="space22"]', '[name="space13"]');
        moveAndWait('[name="space31"]', '[name="space22"]');
        moveAndWait('[name="space13"]', '[name="space35"]');
        moveAndWait('[name="space22"]', '[name="space13"]');
        moveAndWait('[name="space42"]', '[name="space24"]');

        // Restart the game 
        cy.get('a[href="./"]').click();        

        // Confirming succesful restart 
        cy.get('[src="me1.gif"]').then($blueElementsAfterRestart => {
            const blueNamesAfterRestart = $blueElementsAfterRestart.toArray().map(elem => elem.getAttribute('name')).join();
            expect(blueNamesAfterRestart).to.equal(initialBlueNames);
        });
        cy.get('[src="you1.gif"]').then($orangeElementsAfterRestart => {
            const orangeNamesAfterRestart = $orangeElementsAfterRestart.toArray().map(elem => elem.getAttribute('name')).join();
            expect(orangeNamesAfterRestart).to.equal(initialOrangeNames);
        });

    })

    // util functions

    // Click actions on the game board and wait for the message to update 
    const moveAndWait = (startCell, endCell) => {

        cy.get(startCell).click();
        cy.get(endCell).click();
        cy.wait(2000);
        cy.get('#message').should('have.text', actions.moveAction);
    };
});


