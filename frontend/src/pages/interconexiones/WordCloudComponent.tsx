// Copy: https://dev.to/mattlewandowski93/creating-a-word-cloud-in-react-1999
import React, { forwardRef, useCallback, useMemo } from "react";
import WordCloud from "react-d3-cloud";

type Word = { text: string; value: number };

type Props = {
    words: Word[];
};

const MAX_FONT_SIZE = 200;
const MIN_FONT_SIZE = 30;
const MAX_FONT_WEIGHT = 700;
const MIN_FONT_WEIGHT = 400;
const MAX_WORDS = 150;

export const WordCloudComponent = forwardRef<HTMLDivElement, Props>(
    ({ words }, ref) => {

        const sortedWords = useMemo(
            () => words.sort((a, b) => b.value - a.value).slice(0, MAX_WORDS),
            [words]
        );

        const [minOccurences, maxOccurences] = useMemo(() => {
            const min = Math.min(...sortedWords.map((w) => w.value));
            const max = Math.max(...sortedWords.map((w) => w.value));
            return [min, max];
        }, [sortedWords]);

        const calculateFontSize = useCallback(
            (wordOccurrences: number) => {
                const normalizedValue =
                    (wordOccurrences - minOccurences) / (maxOccurences - minOccurences);
                const fontSize =
                    MIN_FONT_SIZE + normalizedValue * (MAX_FONT_SIZE - MIN_FONT_SIZE);
                return Math.round(fontSize);
            },
            [maxOccurences, minOccurences]
        );

        const calculateFontWeight = useCallback(
            (wordOccurrences: number) => {
                const normalizedValue =
                    (wordOccurrences - minOccurences) / (maxOccurences - minOccurences);
                const fontWeight =
                    MIN_FONT_WEIGHT +
                    normalizedValue * (MAX_FONT_WEIGHT - MIN_FONT_WEIGHT);
                return Math.round(fontWeight);
            },
            [maxOccurences, minOccurences]
        );

        return (
            <div className='prevent-select' ref={ref} style={{ width: "900px", height: "500px"}}>
                <WordCloud
                    width={1800}
                    height={1000}
                    font={"Poppins"}
                    fontWeight={(word) => calculateFontWeight(word.value)}
                    data={sortedWords}
                    rotate={0}
                    fontSize={(word) => calculateFontSize(word.value)}
                    random={() => 0.5}
                />
            </div>
        );
    }
);

WordCloudComponent.displayName = "WordCloud";