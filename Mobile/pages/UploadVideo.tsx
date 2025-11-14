import { Text, TextInput, View } from "react-native";
import * as ImagePicker from 'expo-image-picker';
import { useState } from "react";
import TrackMeButton from "../common/components/display/TrackMeButton";
import { VideoView, useVideoPlayer } from 'expo-video';
import GeneralService from "../services/GeneralService";
import { useNavigation } from "@react-navigation/native";
import ReactNativeBlobUtil from 'react-native-blob-util';


const UploadVideo = () => {
    const [videoTitle, setVideoTitle] = useState<string>("");
    const [videoDescription, setVideoDescription] = useState<string>("");
    const [videoFile, setVideoFile] = useState<string>("");
    const player = useVideoPlayer(videoFile ? { uri: videoFile } : null, player => {
        player.loop = true;
    });
    const navigation = useNavigation<any>();
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
        setVideoFile(result.assets[0].uri);
    };

    const handleSubmit = async () => {
        if (!videoTitle || !videoFile) {
            return;
        }
        const presignedUrlResp = await GeneralService.generatePresignedS3Url(videoTitle, "videos");
        if(!presignedUrlResp.ok){
            return;
        }
        const { presigned_url } = await presignedUrlResp.json();
        const filePath = videoFile.replace('file://', '');

        const response = await ReactNativeBlobUtil.fetch(
            'PUT',
            presigned_url,
            {
                'Content-Type': 'video/mp4',
            },
            ReactNativeBlobUtil.wrap(filePath)
        );
        if (response.info().status !== 200) {
            
            return;
        }
    }

    return (
        <View>
            <Text>Title</Text>
            <TextInput placeholder="Enter video title" value={videoTitle} onChangeText={setVideoTitle} />
            <Text>Description</Text>
            <TextInput placeholder="Enter video description" multiline={true} numberOfLines={4} value={videoDescription} onChangeText={setVideoDescription} />
            <Text>Video File</Text>
            {videoFile ? (
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
            <TrackMeButton text="Submit" onPress={handleSubmit} />
        </View>
    );
}
export default UploadVideo;