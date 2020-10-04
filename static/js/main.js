$(function() {
    $('#ajax').on('click', function(){
        const req = $.ajax('/lucky');

        req.done(function(){
            const { file, type } = req.responseJSON;

            if (!file || type === 'unknown') {
                $('p').html(`Você <strong>não</strong> está com sorte hoje...`);
            }

            if (type === 'image') {
                $('#lucky').replaceWith('<img id="lucky"></img>');
                $('#lucky').attr('src', `/static/uploads/${file}`);
            }
            else if (type === 'document') {
                $('#lucky').replaceWith(`
                    <div id="lucky">
                    <a download>
                        <img src="https://icons-for-free.com/iconfiles/png/512/document+icon-1320087273046857645.png"/>
                        Você conseguiu um documento novo!
                    </a>
                    </div>
                `);

                $('#lucky img').css('width', 32);
                $('#lucky a').attr('href', `/static/uploads/${file}`)
            }
            else if (type === 'text') {
                const req = $.ajax(`/static/uploads/${file}`);

                req.done(function(){
                    $('#lucky').replaceWith('<p id="lucky"></p>')
                    $('#lucky').text(req.responseText);
                });
            }
        });
    });
});
