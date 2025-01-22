import * as React from 'react';
import Svg, {Path, SvgProps} from 'react-native-svg';
const HomeIcon = (props: SvgProps) => (
    <Svg
        width={22}
        height={25}
        fill="red"
        {...props}
    >
        <Path
            fill={props.color}
            d="M2.75 25c-.756 0-1.403-.28-1.942-.839A2.807 2.807 0 0 1 0 22.143V9.286C0 8.833.098 8.405.293 8A2.71 2.71 0 0 1 1.1 7L9.35.571c.252-.19.516-.333.79-.428C10.417.048 10.703 0 11 0c.298 0 .584.048.86.143.274.095.538.238.79.428L20.9 7c.344.262.613.595.809 1 .194.405.291.833.291 1.286v12.857a2.81 2.81 0 0 1-.807 2.018c-.54.56-1.187.839-1.943.839h-5.5V15h-5.5v10h-5.5Z"
        />
    </Svg>
)
export default HomeIcon;
