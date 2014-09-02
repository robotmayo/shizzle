(function(){
    window.$ = window.Shizzle = Shizzle;

    function Shizzle(selector){
        if(typeof selector != 'string') return new Error("Selctor must be a string!");
        var charArray = selector.trim().split('')
        ,   tokens = tokenize(charArray)
        console.log(tokens);
    }

    function tokenize(charArray){
        var currentChar = charArray[0]
        ,   currentSet
        ,   pos = 0
        ,   currentToken
        ,   next
        ,   tokens = [];

        while(currentChar){
            if(currentChar === "#"){
                currentToken = token("id");
                tokens.unshift(currentToken); // The right most id gets pushed to the front as ids are unique
            }else if(currentChar === '.'){
                currentToken = token("class");
                tokens.push(currentToken);
            }else if(currentChar !== ' '){
                currentToken = token("element", currentChar);
                tokens.push(currentToken);
            }
            next = charArray[++pos];
            while(next){
                if(next.match(/^[a-z]+$/)){
                    currentToken.value += next;
                    next = charArray[++pos];
                }else{
                    break;
                }
            }
            currentChar = charArray[pos];
        }
        return tokens;
    }

    function token(type, value){
        return {
            type : type,
            value : value || ''
        }
    }
}())