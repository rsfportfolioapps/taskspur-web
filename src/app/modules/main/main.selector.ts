import { createSelector } from "@ngrx/store";

export const mainSelectorState = (state) => state.main;
export const cardState = (state) => state.main.cards;

export const mainSelector = createSelector(
  mainSelectorState,
  cards => cards,
  archivedCards => archivedCards,
  boards => boards
)

export const profileInfoSelector = createSelector(
  mainSelectorState,
  profileInfo => profileInfo,
  user => user
);

export const cardsSelector = createSelector(
  mainSelectorState,
  state => state.cards
)

export const getItemById = (id) => createSelector(cardState, (cards) => {
  return cards.filter(x => x.id === id);
});

export const archivedCardsSelector = createSelector(
  mainSelectorState,
  state => state.archivedCards
)

export const boardsSelector = createSelector(
  mainSelectorState,
  state => state.boards
)
