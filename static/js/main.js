$(function() {
    $('#ajax').on('click', function(){
        const req = $.ajax('/lucky');

        req.done(function(){
            const { file, type } = req.responseJSON;

            if (!file || !type) {
                $('#lucky').replaceWith(`<p id="lucky">Você <strong>não</strong> está com sorte hoje...</p>`);
            }
            else if (type.split('/')[0] === 'image') {
                $('#lucky').replaceWith('<img id="lucky"></img>');
                $('#lucky').attr('src', `/static/uploads/${file}`);
            }
            else if (type.split('/')[0] === 'application') {
                $('#lucky').replaceWith(`
                    <div id="lucky">
                    <a download>
                        <img src="https://icons-for-free.com/iconfiles/png/512/document+icon-1320087273046857645.png"/>
                        <br>
                        Você conseguiu um documento novo!
                    </a>
                    </div>
                `);

                $('#lucky img').css('width', 32);
                $('#lucky a').attr('href', `/static/uploads/${file}`)
            }
            else if (type.split('/')[0] === 'text') {
                const req = $.ajax(`/static/uploads/${file}`);

                req.done(function(){
                    $('#lucky').replaceWith(`
                        <div id="lucky">
                        <p> Você conseguiu um arquivo de texto com conteúdo: </p>
                        <span></span>
                        </div>
                    `);
                    const span = $('#lucky span');
                    span.text(req.responseText);
                    span.html(span.html().replace(/\n/g, '<br>'));
                });
            }
        });
    });

    $('#file').on('change', function(){
        console.log($(this)[0].files);

        if ($(this)[0].files){
            $('#message').text($(this)[0].files[0].name);
        }
        else {
            $('#message').text('Nenhum arquivo selectionado');
        }
    })

    $('#submit').on('click', function(){
        const fd = new FormData();
        const file = $('#file')[0].files[0];

        fd.append('file', file);
        const req = $.ajax({
            url: '/upload',
            type: 'post',
            data: fd,
            contentType: false,
            processData: false
        });

        req.done(function(){
            $('#message').text(req.responseText);
            $('#file').val('');
            console.log($('#file')[0].files);
        });
    });
});
