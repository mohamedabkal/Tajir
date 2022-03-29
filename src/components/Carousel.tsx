import React, { useRef, useState, useEffect } from "react";
import { FlatList, Image, StyleSheet } from 'react-native';

import AssetsManager from "../assets/AssetsManager";
import Colors from "../constants/Colors";
import useColorScheme from "../hooks/useColorScheme";


export default function Carousel() {
    const [currentIndex, setCurrentIndex] = useState(0);
    const slidesRef = useRef(null);

    const theme = useColorScheme();

    const slides = [
        AssetsManager.Images.headache,
        AssetsManager.Images.click,
        AssetsManager.Images.report,
    ];

    // Function to move the slider
    const scroll = () => {
        if (currentIndex < slides.length - 1) {
            slidesRef?.current.scrollToIndex({ index: currentIndex + 1 });
            setCurrentIndex(currentIndex + 1);
        } else {
            slidesRef?.current.scrollToIndex({ index: 0 });
            setCurrentIndex(0);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => scroll(), 3000);
        return () => clearInterval(interval);
    }, [currentIndex])

    return (
        <FlatList
            data={slides}
            keyExtractor={(item, index) => index.toString()}
            renderItem={({ item }) => <Image source={item} style={{ height: 140, resizeMode: 'contain' }} />}
            horizontal
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={0}
            bounces={false}
            ref={slidesRef}
            contentContainerStyle={{ alignItems: 'center', justifyContent: 'center', }}
            style={[styles.featuresContainer, { backgroundColor: Colors[theme].primary }]}
            scrollEnabled={false}
        />
    )
};


const styles = StyleSheet.create({
    featuresContainer: {
        maxHeight: 216,
        paddingBottom: 16,
    },
    feature: {
        height: '100%',
        paddingHorizontal: 16,
    }
})