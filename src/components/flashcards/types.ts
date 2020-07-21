export interface StyleOptions {
    backgroundColor?: string;
    buttonBackgroundColor?: string;
    buttonColor?: string;
}

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