import Carousel from 'pinar';

/**
 * Carousel index pagination is reversed in RTL mode
 * To fix this we can just reverse 'carousel navigation'
 * because Carousel initialIndex starts from last one in RTL
 */

export const scrollToNext = (caourselRef: Carousel, isRtl: boolean) => {
    if (isRtl) {
        caourselRef?.scrollToPrev();
    } else {
        caourselRef?.scrollToNext();
    }
}

export const scrollToPrev = (caourselRef: Carousel, isRtl: boolean) => {
    if (isRtl) {
        caourselRef?.scrollToNext();
    } else {
        caourselRef?.scrollToPrev();
    }
}