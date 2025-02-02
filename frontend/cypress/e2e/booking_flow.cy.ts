describe('Booking Flow', () => {
  beforeEach(() => {
    // Se connecter avant chaque test
    cy.login('admin@example.com', 'password123');
  });

  it('should complete a booking flow', () => {
    // Visiter la page des réservations
    cy.visit('/bookings');

    // Vérifier que le calendrier est chargé
    cy.get('.fc-view-harness').should('be.visible');

    // Cliquer sur une plage horaire
    cy.get('.fc-timegrid-slot').first().click();

    // Remplir le formulaire de réservation
    cy.get('[data-testid="activity-select"]').click();
    cy.get('[data-testid="activity-option-1"]').click();

    cy.get('[data-testid="customer-name"]').type('John Doe');
    cy.get('[data-testid="customer-email"]').type('john@example.com');
    cy.get('[data-testid="customer-phone"]').type('+33612345678');
    cy.get('[data-testid="participants"]').type('2');

    // Soumettre la réservation
    cy.get('[data-testid="submit-booking"]').click();

    // Vérifier que la réservation est créée
    cy.get('.fc-event').should('contain', 'John Doe');
    
    // Vérifier la notification de succès
    cy.get('.notification-success').should('be.visible');
  });

  it('should handle validation errors', () => {
    cy.visit('/bookings');
    cy.get('.fc-timegrid-slot').first().click();

    // Soumettre sans remplir les champs requis
    cy.get('[data-testid="submit-booking"]').click();

    // Vérifier les messages d'erreur
    cy.get('.error-message').should('be.visible');
  });

  it('should cancel a booking', () => {
    cy.visit('/bookings');

    // Cliquer sur une réservation existante
    cy.get('.fc-event').first().click();

    // Cliquer sur le bouton d'annulation
    cy.get('[data-testid="cancel-booking"]').click();

    // Confirmer l'annulation
    cy.get('[data-testid="confirm-cancel"]').click();

    // Vérifier que la réservation est supprimée
    cy.get('.fc-event').should('not.exist');
  });
});
