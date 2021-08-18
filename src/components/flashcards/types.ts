export interface Flashcard {
    front: {
        text?: string;
        imageUrl?: string;
        alt?: string;
        html?: string;
        disableCentering?: boolean;
    },
    back: {
        text?: string;
        imageUrl?: string;
        alt?: string;
        html?: string;
        disableCentering?: boolean;
    }
}