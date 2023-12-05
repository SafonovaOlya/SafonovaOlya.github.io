
import blackJack from "../fixtures/blackJack.json"

describe('Blackjack game API', () => {

    let deckId;

    it('Check Site is up', () => {

        cy.visit('https://deckofcardsapi.com/');
        cy.get('h1').contains(blackJack.welcomeHeader).should('be.visible');
    });

    it('Create new game by creating new deck', () => {

        cy.request({
        method: 'GET',
        url: 'https://deckofcardsapi.com/api/deck/new/',
            qs: {
                deck_count: 1
            }
        }).then((response) => {
        
            expect(response.status).to.equal(200);
            expect(response.body.success).to.equal(true);
            expect(response.body.remaining).to.equal(52);

            deckId = response.body.deck_id;
        });
    });

    it('Shuffle deck', () => {
        cy.request({
            method: 'GET',
            url: `https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`
        }).then((responseShuffle) => {
            expect(responseShuffle.status).to.equal(200);
            expect(responseShuffle.body.success).to.equal(true);
            expect(responseShuffle.body).to.have.property('deck_id');
            expect(responseShuffle.body.shuffled).to.equal(true);
            expect(responseShuffle.body.remaining).to.equal(52);
        });
    });

    it('Deal three cards to each of two players', ()=> {

        cy.request({
            method: 'GET',
            url: `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=6`
        }).then((responseDraw) => {

            expect(responseDraw.status).to.equal(200);
            expect(responseDraw.body.success).to.equal(true);
            expect(responseDraw.body).to.have.property('deck_id');
            expect(responseDraw.body.cards).to.have.lengthOf(6);
            expect(responseDraw.body.remaining).to.equal(46); // 52-6
            expect(responseDraw.body).to.have.property('cards').that.is.an('array');

            const player1Cards = responseDraw.body.cards.slice(0, 3);
            const player2Cards = responseDraw.body.cards.slice(3, 6);

            // Checking for blackjack for each player
            const hasBlackjackPlayer1 = checkForBlackjack(player1Cards);
            const hasBlackjackPlayer2 = checkForBlackjack(player2Cards);

            if (hasBlackjackPlayer1) {
                cy.log('Player1 has BlackJack');
            }
            if (hasBlackjackPlayer2) {
                cy.log('Player1 has BlackJack');
            }
        });
    });
});

/**
 * Count Cards values and return true if 21
 * @param {Cards[]} cards 
 * @returns boolean
 */
function checkForBlackjack(cards) {
    const totalValue = cards.reduce((acc, card) => {
        if (['KING', 'QUEEN', 'JACK'].includes(card.value)) {
            return acc + 10;
        } else if (card.value === 'ACE') {
            return acc + 11;
        } else {
            return acc + parseInt(card.value);
        }
    }, 0);
    cy.log(totalValue);
    return totalValue === 21;
}