import React, { useImperativeHandle, useRef, useEffect, useState } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import GalleryDialog from 'components/GalleryDialog';

interface Props {
    html:any;
}

const Index = React.forwardRef(({ html }:Props, ref) => {

    const [visibleGalleryDialog, setVisibleGallery] = useState(false);

    

    const editorRef = useRef<any>(null);
	useImperativeHandle(ref, () => (
		{
			getContent: () => {
				return editorRef.current.getContent();
			}
		}
	), [html]);

    const onSelectPhoto = (ele:any) => {
        setVisibleGallery(false);
        console.log('photo ==>', ele[0]);
        const photo = ele[0];
        const imgContent = `<div id="attachment_71597" class="wp-caption alignleft" style="width: 500px;" data-mce-style="width: 500px;"><img class="size-medium wp-image-71597" src="${photo.url}" alt="${photo.alt}" width="500" height="326" data-mce-src="${photo.url}" data-mce-selected="1" /><p class="caption">${photo.description}</p></div>`;
        editorRef.current.insertContent(imgContent);
        // onChangePhoto(ele[0]);
    };

    return (
        <>
            <Editor
                    apiKey = "n16h33nt1xigk2hha9alkvvgxqyqa48akfey3cg9c6xdxxrc"
                    onInit={(evt, editor) => {
                        editorRef.current = editor;
                    }}
                    initialValue = {html}
                    init={{
                        height: 500,
                        menubar: false,
                        plugins: [
                            'advlist autolink lists link image charmap print preview anchor',
                            'searchreplace visualblocks code fullscreen',
                            'insertdatetime media table paste code help wordcount'
                        ],
                        setup: function (editor) {
                            editor.ui.registry.addButton('imgInsertButton', {
                                text: 'Insert Image',
                                onAction: function (_) {
                                // editor.insertContent('&nbsp;<strong>It\'s my button!</strong>&nbsp;');
                                    setVisibleGallery(true);
                                }
                            });
                        },
                        toolbar: 'undo redo | formatselect | ' + ' link imgInsertButton |' +
                        'bold italic backcolor | alignleft aligncenter ' +
                        'alignright alignjustify | bullist numlist outdent indent | ' +
                        'removeformat | help ',
                        content_style: 'body { font-family:OpenSans,sans-serif; font-size:14px }',
                        paste_preprocess: function(plugin:any, args:any) {
                            args.content = args.content.replace(/<span[^>]+>/g, '');
                            args.content = args.content.replace(/<\/span>/g, '');
                        }
                }}/>

                <GalleryDialog open = {visibleGalleryDialog} onSelect = {onSelectPhoto} onClose = {()=>{setVisibleGallery(false);}}/>
        </>
    );
});

export default Index;