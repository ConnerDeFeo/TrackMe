import { Text, TextInput, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import TrackMeButton from "../common/components/display/TrackMeButton";
import { VideoView, useVideoPlayer } from 'expo-video';

const UploadVideo = () => {
    const [videoTitle, setVideoTitle] = useState<string>("");
    const [videoDescription, setVideoDescription] = useState<string>("");
    const [videoUrl, setVideoUrl] = useState<string>("");
    const player = useVideoPlayer(videoUrl ? { uri: videoUrl } : null, player => {
        player.loop = true;
    });
    // handle image upload
    const handleVideoUpload = async () => {
        await ImagePicker.requestMediaLibraryPermissionsAsync();
        const result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ["videos"],
            aspect: [1, 1],
            quality: 1,
        });

        if (result.canceled) {
            return;
        }
        const image = await fetch(result.assets[0].uri);
        setVideoUrl(result.assets[0].uri);
    };

    const handleSubmit = () => {
        
    }

    return (
        <View>
            <Text>Title</Text>
            <TextInput placeholder="Enter video title" />
            <Text>Description</Text>
            <TextInput placeholder="Enter video description" multiline={true} numberOfLines={4} />
            <Text>Video File</Text>
            {videoUrl ? (
                <VideoView
                    player={player}
                    allowsPictureInPicture
                    style={{ width: 300, height: 300 }}
                />
            ) : (
                <View>
                    <Text>No video selected</Text>
                </View>
            )}
            <TrackMeButton text="Upload Video" onPress={handleVideoUpload} />
            <TrackMeButton text="Submit" onPress={handleVideoUpload} />
        </View>
    );
}
export default UploadVideo;