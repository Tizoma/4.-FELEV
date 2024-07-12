
function Info(pokeBalls, playerPokemons) {
    //console.log(pokeBalls.pokeBalls,playerPokemons);
    return (
        <div>
            <div>
                No. of Poké Balls: {pokeBalls.pokeBalls}
            </div>
            <div>
                Pokémons:
                <ul className="browser-default">
                    <li>charmander <button>Release charmander</button></li>
                </ul>
            </div>
        </div>
        

    )
}

export default Info;