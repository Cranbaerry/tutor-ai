import React from 'react';
import UseAnimations from "react-useanimations";
import activity from 'react-useanimations/lib/activity';

export function MicIndicator({ listening, transcript }: { listening: boolean , transcript: string}) {
    return (
        <div className="mic-indicator">
            <UseAnimations animation={activity} size={30} />
            {/* <span className="status mx-1">{listening ? 'Listening' : 'Muted'}</span> */}
            <span className="status mx-1">{transcript}</span>
        </div>
    );
};
